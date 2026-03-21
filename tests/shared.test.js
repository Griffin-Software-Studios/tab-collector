import test from "node:test";
import assert from "node:assert/strict";

import { setChromeMock } from "./test-helpers.js";

setChromeMock();

const shared = await import("../shared.js");

test("normalizeSettings migrates legacy toolbar action values", () => {
  assert.deepEqual(shared.normalizeSettings({ toolbarAction: "send-window" }), {
    toolbarAction: shared.TOOLBAR_ACTIONS.SAVE_WINDOW
  });
  assert.deepEqual(shared.normalizeSettings({ toolbarAction: "send-current" }), {
    toolbarAction: shared.TOOLBAR_ACTIONS.SAVE_CURRENT
  });
  assert.deepEqual(shared.normalizeSettings({ toolbarAction: shared.TOOLBAR_ACTIONS.POPUP }), {
    toolbarAction: shared.TOOLBAR_ACTIONS.POPUP
  });
  assert.deepEqual(shared.normalizeSettings({ theme: "unknown", themeMode: "custom" }), {
    theme: "griffin",
    themeMode: "system"
  });
});

test("shared defaults include the Tab Collector omnibox suggestion and lock deletion rule", () => {
  assert.equal(
    shared.DEFAULT_OMNIBOX_SUGGESTION,
    "Search Tab Collector for <match>%s</match>"
  );
  assert.equal(shared.canDeleteSavedGroup({ locked: false }), true);
  assert.equal(shared.canDeleteSavedGroup({ locked: true }), false);
  assert.equal(shared.canDeleteSavedGroup(null), false);
});

test("normalizeExcludedDomains strips schemes, deduplicates, and sorts", () => {
  const normalized = shared.normalizeExcludedDomains([
    " https://www.Example.com/path?q=1 ",
    "example.com",
    "HTTP://sub.example.com/a",
    "bad value",
    "",
    null
  ]);

  assert.deepEqual(normalized, ["example.com", "sub.example.com"]);
});

test("loadState merges defaults and normalizes stored exclusions", async () => {
  setChromeMock({
    settings: {
      toolbarAction: "send-window",
      includePinned: true
    },
    groups: [
      {
        title: "",
        tabs: [{ url: "https://example.com/path", title: "" }]
      }
    ],
    excludedDomains: ["https://www.Example.com", "example.com", "sub.example.com/path"]
  });

  const state = await shared.loadState();

  assert.equal(state.settings.toolbarAction, shared.TOOLBAR_ACTIONS.SAVE_WINDOW);
  assert.equal(state.settings.includePinned, true);
  assert.equal(state.settings.theme, "griffin");
  assert.equal(state.settings.themeMode, "system");
  assert.deepEqual(state.excludedDomains, ["example.com", "sub.example.com"]);
  assert.equal(state.groups.length, 1);
  assert.equal(state.groups[0].title, shared.DEFAULT_GROUP_TITLE);
  assert.equal(state.groups[0].tabs[0].title, "https://example.com/path");
});

test("parseImportedState supports supported HTML exports with flat and nested groups", () => {
  const imported = shared.parseImportedState(`<!DOCTYPE html>
    <html>
      <head>
        <title>Saved tabs export</title>
      </head>
      <body>
        <div class="tabGroup">
          <div class="tabGroupHeader">
            <div class="tabGroupHeaderRow">
              <div class="tabGroupTitleText">2 tabs</div>
            </div>
            <div class="createdDate">Created 3/14/2026, 1:15:53 PM</div>
          </div>
          <div class="tabList">
            <div class="tab"><a class="tabLink" href="https://example.com/path?a=1&amp;b=2">Example &amp; Docs</a></div>
            <div class="tab"><a class="tabLink" href="edge://extensions">Extensions</a></div>
          </div>
        </div>
        <div class="tabGroup">
          <div class="tabGroupHeader">
            <div class="tabGroupHeaderRow">
              <div class="tabGroupTitleText">Project setup</div>
              <div class="tabCountInline">1 tab</div>
            </div>
            <div class="createdDate">Created 3/12/2026, 4:34:07 PM</div>
          </div>
          <div class="tabList">
            <div class="innerGroupBlock">
              <div class="innerGroupTitleText">Frontend</div>
              <div class="innerGroupNotes">Keep these first</div>
              <div class="tab"><a class="tabLink" href="https://example.com/ui">UI</a></div>
            </div>
          </div>
        </div>
      </body>
    </html>`);

  assert.equal(imported.groups.length, 2);
  assert.deepEqual(imported.excludedDomains, []);
  assert.equal(imported.groups[0].title, "Example & Docs +1");
  assert.equal(imported.groups[0].tabs[0].url, "https://example.com/path?a=1&b=2");
  assert.equal(imported.groups[0].tabs[1].title, "Extensions");
  assert.equal(Number.isNaN(Date.parse(imported.groups[0].createdAt)), false);
  assert.equal(imported.groups[1].title, "Project setup / Frontend");
  assert.equal(imported.groups[1].notes, "Keep these first");
  assert.equal(imported.groups[1].tabs[0].url, "https://example.com/ui");
});

test("mergeImportedState appends imported groups, preserves settings, and refreshes IDs", () => {
  const currentState = {
    settings: { ...shared.DEFAULT_SETTINGS, includePinned: true },
    groups: [
      {
        id: "existing-group",
        title: "Existing",
        createdAt: "2026-03-14T10:00:00.000Z",
        updatedAt: "2026-03-14T10:00:00.000Z",
        archived: false,
        locked: false,
        pinned: false,
        notes: "",
        tabs: [
          {
            id: "existing-tab",
            title: "Existing tab",
            url: "https://current.example.com",
            favIconUrl: "",
            addedAt: "2026-03-14T10:00:00.000Z"
          }
        ]
      }
    ],
    excludedDomains: ["current.example.com"]
  };
  const importedState = shared.parseImportedState(
    JSON.stringify({
      groups: [
        {
          id: "imported-group",
          title: "Imported",
          tabs: [
            {
              id: "imported-tab",
              title: "Imported tab",
              url: "https://imported.example.com",
              favIconUrl: ""
            }
          ]
        }
      ],
      excludedDomains: ["imported.example.com"]
    })
  );

  const merged = shared.mergeImportedState(currentState, importedState);

  assert.equal(merged.settings.includePinned, true);
  assert.equal(merged.groups.length, 2);
  assert.equal(merged.groups[0].id, "existing-group");
  assert.equal(merged.groups[1].title, "Imported");
  assert.notEqual(merged.groups[1].id, "imported-group");
  assert.notEqual(merged.groups[1].tabs[0].id, "imported-tab");
  assert.deepEqual(merged.excludedDomains, ["current.example.com", "imported.example.com"]);
});

test("collector URL helpers use the extension runtime URL", () => {
  const collectorUrl = shared.getCollectorUrl("focus group");

  assert.equal(
    collectorUrl,
    "chrome-extension://tab-collector/collector.html?search=focus%20group"
  );
  assert.equal(shared.isCollectorUrl("chrome-extension://tab-collector/collector.html"), true);
  assert.equal(shared.isCollectorUrl("https://example.com"), false);
});

test("formatUrlForDisplay returns the expected representation for each mode", () => {
  const url = "https://www.example.com/path/to/page?q=1";

  assert.equal(shared.formatUrlForDisplay(url, "none"), "");
  assert.equal(shared.formatUrlForDisplay(url, "domain"), "example.com");
  assert.equal(shared.formatUrlForDisplay(url, "full"), url);
  assert.ok(shared.formatUrlForDisplay(url, "abbreviated").startsWith("https://www.example.com"));
});

test("deriveGroupTitle and makeGroup produce project-native saved-group defaults", () => {
  const tabs = [
    {
      title: "Inbox",
      url: "https://mail.example.com/inbox"
    },
    {
      title: "Docs",
      url: "https://docs.example.com/"
    }
  ];

  const title = shared.deriveGroupTitle(tabs, shared.DEFAULT_GROUP_TITLE);
  const group = shared.makeGroup(tabs);

  assert.equal(title, "Inbox +1");
  assert.equal(group.title, "Inbox +1");
  assert.equal(group.archived, false);
  assert.equal(group.locked, false);
  assert.equal(group.pinned, false);
  assert.equal(group.tabs.length, 2);
});

test("buildClipboardPayload escapes HTML while keeping plain text useful", () => {
  const payload = shared.buildClipboardPayload(
    [
      {
        title: "A <B>",
        url: "https://example.com/?a=1&b=2"
      }
    ],
    "rich"
  );

  assert.equal(payload.text, "A <B> | https://example.com/?a=1&b=2");
  assert.match(payload.html, /A &lt;B&gt;/);
  assert.match(payload.html, /https:\/\/example\.com\/\?a=1&amp;b=2/);
});

test("sortGroups, getEligibleDestinationGroup, and matchesSearch reflect saved-tab behavior", () => {
  const groups = [
    {
      id: "older",
      title: "Ops queue",
      notes: "Review alerts",
      updatedAt: "2026-03-10T10:00:00.000Z",
      pinned: true,
      locked: false,
      tabs: [{ title: "Alerts", url: "https://alerts.example.com" }]
    },
    {
      id: "newer",
      title: "Docs",
      notes: "",
      updatedAt: "2026-03-12T10:00:00.000Z",
      pinned: false,
      locked: false,
      tabs: [{ title: "Guide", url: "https://docs.example.com/start" }]
    },
    {
      id: "locked",
      title: "Locked",
      notes: "",
      updatedAt: "2026-03-11T10:00:00.000Z",
      pinned: false,
      locked: true,
      tabs: [{ title: "Spec", url: "https://spec.example.com" }]
    }
  ];

  const sorted = shared.sortGroups(groups);

  assert.deepEqual(
    sorted.map((group) => group.id),
    ["newer", "locked", "older"]
  );
  assert.equal(shared.getEligibleDestinationGroup(groups)?.id, "newer");
  assert.equal(shared.matchesSearch(groups[0], "alerts"), true);
  assert.equal(shared.matchesSearch(groups[1], "docs.example.com"), true);
  assert.equal(shared.matchesSearch(groups[2], "missing"), false);
});

test("saveState writes the full extension state through chrome.storage.local", async () => {
  const { state } = setChromeMock();
  const nextState = {
    settings: { ...shared.DEFAULT_SETTINGS, includePinned: true },
    groups: [],
    excludedDomains: ["example.com"]
  };

  await shared.saveState(nextState);

  assert.deepEqual(state.settings, nextState.settings);
  assert.deepEqual(state.groups, []);
  assert.deepEqual(state.excludedDomains, ["example.com"]);
});
