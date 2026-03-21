import { spawn } from "node:child_process";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..", "..");
const screenshotsDir = path.join(repoRoot, "tests", "assets", "screenshots");
const runtimeDir = path.join(repoRoot, "tests", "manual", "runtime");
const reportPath = path.join(repoRoot, "tests", "manual", "EDGE_RELEASE_CHECKLIST.md");
const resultsPath = path.join(repoRoot, "tests", "manual", "edge-release-results.json");
const edgePath =
  process.env.EDGE_PATH || "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const port = Number(process.env.EDGE_DEBUG_PORT || "9229");

const demoState = {
  settings: {
    theme: "griffin",
    themeMode: "dark",
    startupBehavior: "manual",
    restoreBehavior: "remove",
    toolbarAction: "popup",
    duplicates: "allow",
    includePinned: false,
    openAction: "switch",
    urlDisplay: "domain",
    restoreTabFocus: "switch",
    restoreGroupDestination: "new-window",
    clipboardFormat: "rich",
    contextMenuEnabled: true,
    saveMemoryOnRestore: false
  },
  groups: [
    {
      id: "grp-ops",
      title: "Incident triage",
      createdAt: "2026-03-14T10:00:00.000Z",
      updatedAt: "2026-03-14T10:15:00.000Z",
      archived: false,
      locked: false,
      pinned: true,
      notes: "Use this set to validate restore actions and copy behavior.",
      tabs: [
        {
          id: "tab-ops-1",
          title: "Quarterly Ops Dashboard",
          url: "https://ops.example.test/dashboard",
          favIconUrl: "",
          addedAt: "2026-03-14T10:00:00.000Z"
        },
        {
          id: "tab-ops-2",
          title: "Status Runbook",
          url: "https://docs.example.test/runbook",
          favIconUrl: "",
          addedAt: "2026-03-14T10:00:00.000Z"
        }
      ]
    },
    {
      id: "grp-design",
      title: "Design review",
      createdAt: "2026-03-14T11:00:00.000Z",
      updatedAt: "2026-03-14T11:25:00.000Z",
      archived: false,
      locked: true,
      pinned: false,
      notes: "Locked group used to verify badges and controls.",
      tabs: [
        {
          id: "tab-design-1",
          title: "Collector theme references",
          url: "https://griffin.example.test/theme",
          favIconUrl: "",
          addedAt: "2026-03-14T11:00:00.000Z"
        }
      ]
    }
  ],
  excludedDomains: ["blocked.example.test", "noise.example.test"]
};

class CdpConnection {
  constructor(webSocketUrl) {
    this.webSocketUrl = webSocketUrl;
    this.nextId = 1;
    this.pending = new Map();
    this.eventListeners = new Set();
    this.socket = new WebSocket(webSocketUrl);
    this.ready = new Promise((resolve, reject) => {
      this.socket.addEventListener("open", resolve, { once: true });
      this.socket.addEventListener(
        "error",
        (event) => reject(event.error || new Error(`Failed to connect to ${webSocketUrl}`)),
        { once: true }
      );
    });
    this.socket.addEventListener("message", (event) => {
      const message = JSON.parse(event.data);

      if (message.id) {
        const pending = this.pending.get(message.id);

        if (!pending) {
          return;
        }

        this.pending.delete(message.id);

        if (message.error) {
          pending.reject(new Error(message.error.message || "CDP request failed"));
          return;
        }

        pending.resolve(message.result || {});
        return;
      }

      for (const listener of this.eventListeners) {
        listener(message);
      }
    });
  }

  async send(method, params = {}, sessionId) {
    await this.ready;
    const id = this.nextId++;
    const payload = {
      id,
      method,
      params
    };

    if (sessionId) {
      payload.sessionId = sessionId;
    }

    const result = new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
    });

    this.socket.send(JSON.stringify(payload));
    return result;
  }

  async waitForEvent(method, sessionId, predicate = () => true, timeoutMs = 15000) {
    await this.ready;

    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this.eventListeners.delete(listener);
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeoutMs);

      const listener = (message) => {
        if (message.method !== method) {
          return;
        }

        if (sessionId && message.sessionId !== sessionId) {
          return;
        }

        if (!predicate(message.params || {}, message)) {
          return;
        }

        clearTimeout(timeout);
        this.eventListeners.delete(listener);
        resolve(message.params || {});
      };

      this.eventListeners.add(listener);
    });
  }

  async close() {
    if (this.socket.readyState === WebSocket.OPEN || this.socket.readyState === WebSocket.CONNECTING) {
      this.socket.close();
    }
  }
}

async function main() {
  const profileDir = path.join(
    runtimeDir,
    `edge-profile-${Date.now()}-${Math.random().toString(16).slice(2, 10)}`
  );
  await mkdir(screenshotsDir, { recursive: true });
  await mkdir(profileDir, { recursive: true });

  const edge = launchEdge(profileDir);
  const results = {
    dateUtc: new Date().toISOString(),
    edgePath,
    port,
    extensionId: "",
    screenshots: {},
    checks: []
  };

  try {
    const versionInfo = await waitForDebugger();
    const browser = new CdpConnection(versionInfo.webSocketDebuggerUrl);
    const extensionId = await waitForExtensionId(browser);
    results.extensionId = extensionId;

    const popupDataWindow = await openDemoTabs(browser);
    const seededPage = await openPage(
      browser,
      `chrome-extension://${extensionId}/options.html`,
      { newWindow: false, width: 1400, height: 1200 }
    );

    await waitForSelector(browser, seededPage.sessionId, "#settings-root");
    await seedDemoState(browser, seededPage.sessionId);
    await browser.send("Page.reload", {}, seededPage.sessionId);
    await waitForSelector(browser, seededPage.sessionId, "#settings-root .setting-card");

    const optionsCheck = await collectPageCheck(browser, seededPage.sessionId, {
      id: "options-page",
      description: "Options page renders settings grid, excluded domains, and command list",
      expression:
        "Boolean(document.querySelector('#settings-root .setting-card') && document.querySelector('#excluded-list') && document.querySelector('#commands-list'))"
    });
    results.checks.push(optionsCheck);
    results.screenshots.options = await captureScreenshot(browser, seededPage, {
      outputPath: path.join(screenshotsDir, "options-page-edge.png"),
      width: 1400,
      height: 1200
    });

    const collectorPage = await openPage(
      browser,
      `chrome-extension://${extensionId}/collector.html`,
      { newWindow: false, width: 1600, height: 1400 }
    );
    await waitForSelector(browser, collectorPage.sessionId, "#groups-root .tabGroup");
    const collectorCheck = await collectPageCheck(browser, collectorPage.sessionId, {
      id: "collector-page",
      description: "Collector page renders summary cards and saved groups from seeded state",
      expression:
        "Boolean(document.querySelector('#group-count') && document.querySelector('#tab-count') && document.querySelector('#groups-root .tabGroup'))"
    });
    results.checks.push(collectorCheck);
    results.checks.push(
      await verifyCollectorThemeSelection(browser, collectorPage.sessionId)
    );
    results.screenshots.collector = await captureScreenshot(browser, collectorPage, {
      outputPath: path.join(screenshotsDir, "collector-page-edge.png"),
      width: 1600,
      height: 1400
    });

    const popupPage = await openPage(
      browser,
      `chrome-extension://${extensionId}/popup.html`,
      { newWindow: false, width: 620, height: 1180 }
    );
    await waitForSelector(browser, popupPage.sessionId, "#tabs-list .tab-option");
    const popupCheck = await collectPageCheck(browser, popupPage.sessionId, {
      id: "popup-page",
      description: "Popup page renders quick actions, selected tab list, and quick list",
      expression:
        "Boolean(document.querySelector('[data-action=\"save-window\"]') && document.querySelector('#tabs-list .tab-option') && document.querySelector('#quick-list .quick-item'))"
    });
    results.checks.push(popupCheck);
    results.screenshots.popup = await captureScreenshot(browser, popupPage, {
      outputPath: path.join(screenshotsDir, "popup-page-edge.png"),
      width: 620,
      height: 1180
    });

    results.checks.push({
      id: "page-context-menu",
      description: "Page context menu entries require live right-click validation in an interactive Edge session",
      status: "manual-follow-up"
    });
    results.checks.push({
      id: "native-tab-strip-menu",
      description: "Native tab-strip and tab-group header integration remains unsupported by the documented Edge extension API surface",
      status: "not-applicable"
    });

    await writeFile(resultsPath, JSON.stringify(results, null, 2), "utf8");
    await writeFile(reportPath, renderChecklist(results), "utf8");

    if (popupDataWindow) {
      await closePage(browser, popupDataWindow.sessionId, popupDataWindow.targetId);
    }

    await closePage(browser, popupPage.sessionId, popupPage.targetId);
    await closePage(browser, collectorPage.sessionId, collectorPage.targetId);
    await closePage(browser, seededPage.sessionId, seededPage.targetId);
    await browser.close();
  } finally {
    edge.kill("SIGKILL");
    await waitForProcessExit(edge);
    await rm(profileDir, { recursive: true, force: true });
  }
}

function launchEdge(profileDir) {
  const args = [
    `--user-data-dir=${profileDir}`,
    `--remote-debugging-port=${port}`,
    `--disable-extensions-except=${repoRoot}`,
    `--load-extension=${repoRoot}`,
    "--no-first-run",
    "--no-default-browser-check",
    "--new-window",
    "about:blank"
  ];

  return spawn(edgePath, args, {
    stdio: "ignore",
    windowsHide: false
  });
}

async function waitForDebugger() {
  return retry(async () => {
    const response = await fetch(`http://127.0.0.1:${port}/json/version`);

    if (!response.ok) {
      throw new Error(`Debugger endpoint returned ${response.status}`);
    }

    return response.json();
  }, 30, 500);
}

async function waitForExtensionId(browser) {
  const targetInfo = await retry(async () => {
    const { targetInfos } = await browser.send("Target.getTargets");
    const serviceWorker = targetInfos.find(
      (target) =>
        target.type === "service_worker" &&
        target.url.startsWith("chrome-extension://") &&
        target.url.endsWith("/background.js")
    );

    if (!serviceWorker) {
      throw new Error("Extension service worker target not found");
    }

    return serviceWorker;
  }, 40, 500);

  return new URL(targetInfo.url).hostname;
}

async function openDemoTabs(browser) {
  const firstTab = await openPage(
    browser,
    "data:text/html,<title>Quarterly%20Ops%20Dashboard</title><body><h1>Quarterly Ops Dashboard</h1></body>",
    { newWindow: true, width: 1440, height: 1024 }
  );
  await openPage(
    browser,
    "data:text/html,<title>Status%20Runbook</title><body><h1>Status Runbook</h1></body>",
    { newWindow: false, width: 1440, height: 1024 }
  );
  await openPage(
    browser,
    "data:text/html,<title>Design%20Review</title><body><h1>Design Review</h1></body>",
    { newWindow: false, width: 1440, height: 1024 }
  );
  return firstTab;
}

async function openPage(browser, url, { newWindow, width, height }) {
  const createTargetParams = {
    url,
    newWindow,
    background: false
  };

  if (newWindow) {
    createTargetParams.width = width;
    createTargetParams.height = height;
  }

  const { targetId } = await browser.send("Target.createTarget", createTargetParams);
  const { sessionId } = await browser.send("Target.attachToTarget", {
    targetId,
    flatten: true
  });

  await browser.send("Page.enable", {}, sessionId);
  await browser.send("Runtime.enable", {}, sessionId);
  await browser.send(
    "Emulation.setDeviceMetricsOverride",
    {
      width,
      height,
      deviceScaleFactor: 1,
      mobile: false
    },
    sessionId
  );
  await waitForDocumentReady(browser, sessionId);

  return {
    targetId,
    sessionId,
    width,
    height
  };
}

async function closePage(browser, sessionId, targetId) {
  try {
    await browser.send("Target.closeTarget", { targetId }, sessionId);
  } catch {
    return;
  }
}

async function seedDemoState(browser, sessionId) {
  const expression = `(async () => {
    await chrome.storage.local.set(${JSON.stringify(demoState)});
    return await chrome.storage.local.get(['settings', 'groups', 'excludedDomains']);
  })()`;

  await browser.send(
    "Runtime.evaluate",
    {
      expression,
      awaitPromise: true,
      returnByValue: true
    },
    sessionId
  );
}

async function waitForDocumentReady(browser, sessionId) {
  await retry(async () => {
    const result = await evaluate(browser, sessionId, "document.readyState");

    if (result !== "complete" && result !== "interactive") {
      throw new Error("Document not ready");
    }
  }, 40, 250);
}

async function waitForSelector(browser, sessionId, selector) {
  const expression = `Boolean(document.querySelector(${JSON.stringify(selector)}))`;

  await retry(async () => {
    const exists = await evaluate(browser, sessionId, expression);

    if (!exists) {
      throw new Error(`Selector not found: ${selector}`);
    }
  }, 40, 250);
}

async function evaluate(browser, sessionId, expression) {
  const { result } = await browser.send(
    "Runtime.evaluate",
    {
      expression,
      awaitPromise: true,
      returnByValue: true
    },
    sessionId
  );

  return result?.value;
}

async function collectPageCheck(browser, sessionId, check) {
  const passed = await evaluate(browser, sessionId, check.expression);

  return {
    id: check.id,
    description: check.description,
    status: passed ? "passed" : "failed"
  };
}

async function verifyCollectorThemeSelection(browser, sessionId) {
  const darkBackground = await evaluate(
    browser,
    sessionId,
    "getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim()"
  );

  await evaluate(
    browser,
    sessionId,
    `(() => {
      const themeSelect = document.querySelector('#theme-select');
      const appearanceSelect = document.querySelector('#theme-mode-select');
      // Griffin is the current theme with explicit light/dark/system variants.
      themeSelect.value = 'griffin';
      themeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      appearanceSelect.value = 'light';
      appearanceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      return document.documentElement.dataset.themeMode;
    })()`
  );

  await retry(async () => {
    const themeMode = await evaluate(browser, sessionId, "document.documentElement.dataset.themeMode");
    if (themeMode !== "light") {
      throw new Error("Collector theme mode did not switch to light");
    }
  }, 20, 150);

  const lightBackground = await evaluate(
    browser,
    sessionId,
    "getComputedStyle(document.documentElement).getPropertyValue('--bg-color').trim()"
  );

  await evaluate(
    browser,
    sessionId,
    `(() => {
      const themeSelect = document.querySelector('#theme-select');
      const appearanceSelect = document.querySelector('#theme-mode-select');
      themeSelect.value = 'griffin';
      themeSelect.dispatchEvent(new Event('change', { bubbles: true }));
      appearanceSelect.value = 'dark';
      appearanceSelect.dispatchEvent(new Event('change', { bubbles: true }));
      return document.documentElement.dataset.themeMode;
    })()`
  );

  await retry(async () => {
    const themeMode = await evaluate(browser, sessionId, "document.documentElement.dataset.themeMode");
    if (themeMode !== "dark") {
      throw new Error("Collector theme mode did not switch back to dark");
    }
  }, 20, 150);

  return {
    id: "collector-theme-selection",
    description: "Collector Griffin appearance selection switches between dark and light modes",
    status:
      darkBackground && lightBackground && darkBackground !== lightBackground ? "passed" : "failed"
  };
}

async function captureScreenshot(browser, page, { outputPath, width, height }) {
  await browser.send("Page.bringToFront", {}, page.sessionId);
  const layoutMetrics = await browser.send("Page.getLayoutMetrics", {}, page.sessionId);
  const clipWidth = Math.max(
    1,
    Math.ceil(layoutMetrics.contentSize?.width || 0),
    page.width || 0,
    width || 0
  );
  const clipHeight = Math.max(
    1,
    Math.ceil(layoutMetrics.contentSize?.height || 0),
    page.height || 0,
    height || 0
  );
  const { data } = await browser.send(
    "Page.captureScreenshot",
    {
      format: "png",
      fromSurface: true,
      clip: {
        x: 0,
        y: 0,
        width: clipWidth,
        height: clipHeight,
        scale: 1
      }
    },
    page.sessionId
  );

  await writeFile(outputPath, Buffer.from(data, "base64"));
  return path.relative(repoRoot, outputPath).replaceAll("\\", "/");
}

async function retry(task, attempts, waitMs) {
  let lastError;

  for (let index = 0; index < attempts; index += 1) {
    try {
      return await task();
    } catch (error) {
      lastError = error;
      await sleep(waitMs);
    }
  }

  throw lastError;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForProcessExit(childProcess) {
  if (childProcess.exitCode !== null) {
    return;
  }

  await new Promise((resolve) => {
    childProcess.once("exit", resolve);
  });
}

function renderChecklist(results) {
  const screenshotLines = [
    `- Collector page: \`${results.screenshots.collector || "not captured"}\``,
    `- Options page: \`${results.screenshots.options || "not captured"}\``,
    `- Popup page: \`${results.screenshots.popup || "not captured"}\``
  ];

  const checkLines = results.checks.map(
    (check) => `| ${check.id} | ${check.status} | ${check.description} |`
  );

  return `# Edge Release Checklist\n\n` +
    `Generated: ${results.dateUtc}\n\n` +
    `Edge version path: \`${results.edgePath}\`\n\n` +
    `Extension ID: \`${results.extensionId || "unresolved"}\`\n\n` +
    `## Captured evidence\n\n` +
    `${screenshotLines.join("\n")}\n\n` +
    `## Checks\n\n` +
    `| Check | Status | Notes |\n` +
    `| --- | --- | --- |\n` +
    `${checkLines.join("\n")}\n`;
}

await main();
