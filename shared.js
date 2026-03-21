import {
  THEMES,
  THEME_IDS,
  THEME_MODES,
  normalizeTheme,
  normalizeThemeMode
} from "./theme.js";

export const APP_NAME = "Tab Collector";
export const COLLECTOR_PAGE = "collector.html";
export const OPTIONS_PAGE = "options.html";
export const POPUP_PAGE = "popup.html";
export const DEFAULT_GROUP_TITLE = "Saved tabs";
export const DEFAULT_OMNIBOX_SUGGESTION = "Search Tab Collector for <match>%s</match>";

export const TOOLBAR_ACTIONS = Object.freeze({
  POPUP: "popup",
  SAVE_WINDOW: "save-window",
  SAVE_CURRENT: "save-current"
});

export const MESSAGE_TYPES = Object.freeze({
  OPEN_COLLECTOR: "openCollector",
  SAVE_CURRENT_WINDOW: "saveCurrentWindow",
  SAVE_CURRENT_TAB: "saveCurrentTab",
  SAVE_CURRENT_GROUP: "saveCurrentGroup",
  SAVE_SELECTED_TABS: "saveSelectedTabs",
  RESTORE_GROUP: "restoreGroup",
  RESTORE_TAB: "restoreTab",
  TOGGLE_GROUP_FLAG: "toggleGroupFlag",
  RENAME_GROUP: "renameGroup",
  UPDATE_GROUP_NOTES: "updateGroupNotes",
  DELETE_GROUP: "deleteGroup",
  DELETE_TAB: "deleteTab",
  EXCLUDE_DOMAIN: "excludeDomain"
});

export const POPUP_ACTIONS = Object.freeze({
  OPEN_COLLECTOR: "open-collector",
  SAVE_WINDOW: "save-window",
  SAVE_TAB: "save-tab",
  SAVE_GROUP: "save-group",
  EXCLUDE_SITE: "exclude-site",
  OPEN_OPTIONS: "open-options",
  OPEN_SAVED_GROUP: "open-saved-group"
});

export const CONTEXT_MENU_IDS = Object.freeze({
  OPEN_COLLECTOR: "open-collector",
  SAVE_CURRENT_WINDOW: "save-current-window",
  SAVE_CURRENT_TAB: "save-current-tab",
  SAVE_CURRENT_GROUP: "save-current-group",
  EXCLUDE_SITE: "exclude-site"
});

export const COMMAND_IDS = Object.freeze({
  SAVE_CURRENT_TAB: "save-current-tab",
  OPEN_COLLECTOR: "open-collector"
});

export const DEFAULT_SETTINGS = Object.freeze({
  theme: THEME_IDS.GRIFFIN,
  themeMode: THEME_MODES.SYSTEM,
  startupBehavior: "manual",
  restoreBehavior: "remove",
  toolbarAction: TOOLBAR_ACTIONS.POPUP,
  duplicates: "allow",
  includePinned: false,
  openAction: "switch",
  urlDisplay: "domain",
  restoreTabFocus: "stay",
  restoreGroupDestination: "new-window",
  clipboardFormat: "rich",
  contextMenuEnabled: true,
  saveMemoryOnRestore: false
});

export const SETTINGS_SECTIONS = [
  {
    key: "theme",
    title: "Collector theme",
    note: "Every theme supports system, light, and dark appearance modes.",
    options: THEMES.map((theme) => ({
      value: theme.id,
      label: theme.label,
      description: theme.description
    }))
  },
  {
    key: "themeMode",
    title: "Theme appearance",
    note: "Select a fixed mode or follow your system appearance.",
    options: [
      {
        value: THEME_MODES.SYSTEM,
        label: "System default"
      },
      {
        value: THEME_MODES.LIGHT,
        label: "Light"
      },
      {
        value: THEME_MODES.DARK,
        label: "Dark"
      }
    ]
  },
  {
    key: "startupBehavior",
    title: "At browser startup",
    note: "Choose whether the collector opens automatically when Edge starts.",
    options: [
      {
        value: "open",
        label: "Open Tab Collector automatically"
      },
      {
        value: "manual",
        label: "Do not open Tab Collector automatically",
        description: "Open it manually from the toolbar icon or the page context menu."
      }
    ]
  },
  {
    key: "restoreBehavior",
    title: "When restoring tabs",
    note: "Ctrl/Cmd keeps restored tabs in the list. Alt/Option archives them instead. Locked groups always keep their tabs.",
    options: [
      {
        value: "remove",
        label: "Remove them from your list"
      },
      {
        value: "keep",
        label: "Keep them in your list"
      },
      {
        value: "archive",
        label: "Mark them as archived",
        description: "Archived groups use a gray striped background so finished work stands out."
      }
    ]
  },
  {
    key: "toolbarAction",
    title: "When you click the toolbar icon",
    note: "Use the popup to mimic a native menu while still showing the current window's tabs.",
    options: [
      {
        value: TOOLBAR_ACTIONS.SAVE_WINDOW,
        label: "Save tabs in the current window to Tab Collector",
        description: "If multiple tabs are selected, only the selected tabs are stored. If the active tab is inside a browser tab group, only that tab group is stored."
      },
      {
        value: TOOLBAR_ACTIONS.SAVE_CURRENT,
        label: "Save only the current tab to Tab Collector",
        description: "The current tab is placed inside the first group that is not pinned or locked."
      },
      {
        value: TOOLBAR_ACTIONS.POPUP,
        label: "Show the action popup",
        description: "The popup lets you pick exact tabs, set the group title, and override duplicate or pinned-tab behavior for a single save."
      }
    ]
  },
  {
    key: "duplicates",
    title: "Duplicates",
    options: [
      {
        value: "allow",
        label: "Allow duplicates"
      },
      {
        value: "reject",
        label: "Silently reject duplicates",
        description: "Duplicate detection is based on the stored tab URL and can be overridden inside the popup."
      }
    ]
  },
  {
    key: "includePinned",
    title: "Pinned tabs",
    options: [
      {
        value: false,
        label: "Don't save pinned tabs to Tab Collector"
      },
      {
        value: true,
        label: "Allow pinned tabs to be saved to Tab Collector",
        description: "The popup can override this setting for a single save."
      }
    ]
  },
  {
    key: "openAction",
    title: "\"Open Tab Collector\" action",
    options: [
      {
        value: "switch",
        label: "Switch to the window where the collector is already open"
      },
      {
        value: "move",
        label: "Move any existing collector tab to the current window"
      }
    ]
  },
  {
    key: "urlDisplay",
    title: "URL display",
    options: [
      {
        value: "none",
        label: "None"
      },
      {
        value: "domain",
        label: "Domain only"
      },
      {
        value: "abbreviated",
        label: "Abbreviated"
      },
      {
        value: "full",
        label: "Full"
      }
    ]
  },
  {
    key: "restoreTabFocus",
    title: "When restoring tabs from the collector page",
    note: "Shift opens a clicked tab in a new window.",
    options: [
      {
        value: "stay",
        label: "Open the tab and stay in the collector"
      },
      {
        value: "switch",
        label: "Open the tab and switch to it unless you hold Ctrl or Command"
      }
    ]
  },
  {
    key: "restoreGroupDestination",
    title: "When restoring a group of tabs",
    options: [
      {
        value: "new-window",
        label: "Open the tabs in a new window"
      },
      {
        value: "current-window",
        label: "Open the tabs in the current window"
      }
    ]
  },
  {
    key: "clipboardFormat",
    title: "Copying links to the clipboard",
    note: "Rich text falls back to plain text automatically when the target application cannot accept HTML.",
    options: [
      {
        value: "rich",
        label: "Rich text, where available"
      },
      {
        value: "url-title",
        label: "URL and title"
      },
      {
        value: "title-url",
        label: "Title and URL"
      },
      {
        value: "url-only",
        label: "URL only"
      }
    ]
  },
  {
    key: "contextMenuEnabled",
    title: "Right-click inside a web page to access the context menu",
    note: "Disabling it also removes the \"Exclude website from Tab Collector\" shortcut.",
    options: [
      {
        value: true,
        label: "Enabled"
      },
      {
        value: false,
        label: "Disabled"
      }
    ]
  },
  {
    key: "saveMemoryOnRestore",
    title: "Save memory immediately when tabs are first opened",
    options: [
      {
        value: false,
        label: "Disabled"
      },
      {
        value: true,
        label: "Enabled",
        description: "Background tabs are immediately discarded after they open, which helps when restoring large batches."
      }
    ]
  }
];

export const STORAGE_DEFAULTS = {
  settings: DEFAULT_SETTINGS,
  groups: [],
  excludedDomains: []
};

export function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

export async function loadState() {
  const stored = await chrome.storage.local.get(STORAGE_DEFAULTS);
  const normalizedSettings = normalizeSettings(stored.settings || {});

  return {
    settings: {
      ...DEFAULT_SETTINGS,
      ...normalizedSettings
    },
    groups: Array.isArray(stored.groups) ? stored.groups.map(ensureGroupShape) : [],
    excludedDomains: normalizeExcludedDomains(stored.excludedDomains)
  };
}

export async function saveState(state) {
  await chrome.storage.local.set(state);
  return state;
}

export function parseImportedState(rawText) {
  const trimmedText = String(rawText ?? "").trim();

  if (!trimmedText) {
    throw new Error("The selected file is empty");
  }

  if (looksLikeSupportedHtmlExport(trimmedText)) {
    return {
      groups: parseSavedTabsHtmlExport(trimmedText).map(ensureGroupShape),
      excludedDomains: []
    };
  }

  if (/^\s*</.test(trimmedText)) {
    throw new Error("The selected HTML export format is not supported");
  }

  let parsed;

  try {
    parsed = JSON.parse(trimmedText);
  } catch {
    throw new Error("The selected file is not valid JSON");
  }

  const groups = extractImportedGroups(parsed).map(normalizeImportedGroup).map(ensureGroupShape);
  const excludedDomains =
    parsed && typeof parsed === "object" ? normalizeExcludedDomains(parsed.excludedDomains) : [];

  return {
    groups,
    excludedDomains
  };
}

export function mergeImportedState(currentState, importedState) {
  const currentGroups = Array.isArray(currentState?.groups)
    ? currentState.groups.map(ensureGroupShape)
    : [];
  const importedGroups = Array.isArray(importedState?.groups)
    ? importedState.groups.map(cloneImportedGroupWithFreshIds)
    : [];

  const nextGroups = [
    ...currentGroups,
    ...importedGroups
  ];

  return {
    settings: {
      ...DEFAULT_SETTINGS,
      ...(currentState?.settings || {})
    },
    groups: nextGroups,
    excludedDomains: normalizeExcludedDomains([
      ...(Array.isArray(currentState?.excludedDomains) ? currentState.excludedDomains : []),
      ...(Array.isArray(importedState?.excludedDomains) ? importedState.excludedDomains : [])
    ])
  };
}

export function ensureGroupShape(group) {
  const stamped = group?.createdAt || nowIso();

  return {
    id: group?.id || createId("group"),
    title: group?.title || DEFAULT_GROUP_TITLE,
    createdAt: stamped,
    updatedAt: group?.updatedAt || stamped,
    archived: Boolean(group?.archived),
    locked: Boolean(group?.locked),
    pinned: Boolean(group?.pinned),
    notes: group?.notes || "",
    tabs: Array.isArray(group?.tabs)
      ? group.tabs.map((tab) => ({
          id: tab?.id || createId("tab"),
          title: tab?.title || tab?.url || "Untitled tab",
          url: tab?.url || "",
          favIconUrl: tab?.favIconUrl || "",
          addedAt: tab?.addedAt || stamped
        }))
      : []
  };
}

export function normalizeSettings(settings = {}) {
  const normalized = {
    ...settings
  };

  if ("theme" in normalized) {
    normalized.theme = normalizeTheme(normalized.theme);
  }

  if ("themeMode" in normalized) {
    normalized.themeMode = normalizeThemeMode(normalized.themeMode);
  }

  if (normalized.toolbarAction === "send-window") {
    normalized.toolbarAction = TOOLBAR_ACTIONS.SAVE_WINDOW;
  }

  if (normalized.toolbarAction === "send-current") {
    normalized.toolbarAction = TOOLBAR_ACTIONS.SAVE_CURRENT;
  }

  return normalized;
}

export function normalizeExcludedDomains(excludedDomains = []) {
  const seen = new Set();

  return (Array.isArray(excludedDomains) ? excludedDomains : [])
    .map((value) => normalizeExcludedDomain(value))
    .filter((value) => {
      if (!value || seen.has(value)) {
        return false;
      }

      seen.add(value);
      return true;
    })
    .sort((left, right) => left.localeCompare(right));
}

export function createId(prefix = "id") {
  return `${prefix}-${crypto.randomUUID()}`;
}

export function nowIso() {
  return new Date().toISOString();
}

export function normalizeUrl(url = "") {
  try {
    const parsed = new URL(url);
    parsed.hash = "";
    return parsed.href;
  } catch {
    return url;
  }
}

export function getHostname(url = "") {
  try {
    return new URL(url).hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function normalizeExcludedDomain(value = "") {
  if (value == null) {
    return "";
  }

  const trimmedValue = String(value).trim();

  if (!trimmedValue) {
    return "";
  }

  const host =
    getHostname(trimmedValue) ||
    trimmedValue
      .replace(/^https?:\/\//i, "")
      .replace(/^www\./i, "")
      .replace(/\/.*$/, "")
      .toLowerCase();

  return /^[a-z0-9.-]+$/i.test(host) ? host.toLowerCase() : "";
}

export function isRestrictedUrl(url = "") {
  return /^(edge|chrome|about|extension|chrome-extension):/i.test(url);
}

export function isCollectorUrl(url = "") {
  return url.startsWith(chrome.runtime.getURL(COLLECTOR_PAGE));
}

export function getCollectorUrl(search = "") {
  const base = chrome.runtime.getURL(COLLECTOR_PAGE);
  return search ? `${base}?search=${encodeURIComponent(search)}` : base;
}

export function abbreviateUrl(url = "", maxLength = 88) {
  if (url.length <= maxLength) {
    return url;
  }

  return `${url.slice(0, maxLength - 1)}…`;
}

export function formatUrlForDisplay(url = "", mode = DEFAULT_SETTINGS.urlDisplay) {
  switch (mode) {
    case "none":
      return "";
    case "domain":
      return getHostname(url) || url;
    case "abbreviated":
      return abbreviateUrl(url);
    case "full":
      return url;
    default:
      return getHostname(url) || url;
  }
}

export function deriveGroupTitle(tabs = [], fallback = "Saved tabs") {
  if (!tabs.length) {
    return fallback;
  }

  if (tabs.length === 1) {
    return tabs[0].title || getHostname(tabs[0].url) || fallback;
  }

  const lead = tabs[0].title || getHostname(tabs[0].url) || fallback;
  return `${lead} +${tabs.length - 1}`;
}

export function makeTabRecord(tab) {
  return {
    id: createId("tab"),
    title: tab.title || tab.url || "Untitled tab",
    url: tab.url || "",
    favIconUrl: tab.favIconUrl || "",
    addedAt: nowIso()
  };
}

export function makeGroup(tabs, title = "") {
  const groupTabs = tabs.map(makeTabRecord);
  const stamped = nowIso();

  return {
    id: createId("group"),
    title: title.trim() || deriveGroupTitle(groupTabs),
    createdAt: stamped,
    updatedAt: stamped,
    archived: false,
    locked: false,
    pinned: false,
    notes: "",
    tabs: groupTabs
  };
}

export function updateGroupTimestamp(group) {
  group.updatedAt = nowIso();
  return group;
}

export function getTabCount(groups = []) {
  return groups.reduce((total, group) => total + group.tabs.length, 0);
}

export function sortGroups(groups = []) {
  return [...groups].sort((left, right) => {
    const leftTime = Date.parse(left.updatedAt || left.createdAt || 0);
    const rightTime = Date.parse(right.updatedAt || right.createdAt || 0);
    return rightTime - leftTime;
  });
}

export function getEligibleDestinationGroup(groups = []) {
  return groups.find((group) => !group.pinned && !group.locked) || null;
}

export function canDeleteSavedGroup(group) {
  return Boolean(group) && !group.locked;
}

export function escapeHtml(value = "") {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

export function formatClipboardLine(tab, format) {
  switch (format) {
    case "url-only":
      return tab.url;
    case "url-title":
      return `${tab.url} | ${tab.title}`;
    case "title-url":
      return `${tab.title} | ${tab.url}`;
    case "rich":
    default:
      return `${tab.title} | ${tab.url}`;
  }
}

export function buildClipboardPayload(tabs, format) {
  const text = tabs.map((tab) => formatClipboardLine(tab, format)).join("\n");
  const html =
    "<ul>" +
    tabs
      .map(
        (tab) =>
          `<li><a href="${escapeHtml(tab.url)}">${escapeHtml(tab.title || tab.url)}</a></li>`
      )
      .join("") +
    "</ul>";

  return { text, html };
}

export function matchesSearch(group, rawNeedle) {
  const needle = rawNeedle.trim().toLowerCase();

  if (!needle) {
    return true;
  }

  const haystacks = [
    group.title,
    group.notes,
    ...group.tabs.flatMap((tab) => [tab.title, tab.url, getHostname(tab.url)])
  ];

  return haystacks.some((value) => String(value || "").toLowerCase().includes(needle));
}

function extractImportedGroups(payload) {
  if (Array.isArray(payload)) {
    if (payload.every(isTabImportCandidate)) {
      return [
        {
          title: DEFAULT_GROUP_TITLE,
          tabs: payload
        }
      ];
    }

    if (payload.every(isGroupImportCandidate)) {
      return payload;
    }
  }

  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.groups)) {
      return payload.groups;
    }

    if (Array.isArray(payload.tabs)) {
      return [
        {
          title: payload.title || payload.name || DEFAULT_GROUP_TITLE,
          notes: payload.notes,
          archived: payload.archived,
          locked: payload.locked,
          pinned: payload.pinned,
          tabs: payload.tabs
        }
      ];
    }
  }

  throw new Error("JSON import must contain a groups array or a tabs array");
}

function looksLikeSupportedHtmlExport(rawText) {
  return hasImportedHtmlClass(rawText, "tabGroup") && hasImportedHtmlClass(rawText, "tabLink");
}

function parseSavedTabsHtmlExport(rawText) {
  const segments = rawText.split(buildImportedClassOpenTagPattern("div", "tabGroup")).slice(1);
  const groups = [];

  for (const segment of segments) {
    const outerTitle = normalizeImportedHtmlTitle(getFirstClassText(segment, "tabGroupTitleText"));
    const createdAt = parseImportedCreatedAt(getFirstClassText(segment, "createdDate"));
    const innerBlocks = segment
      .split(buildImportedClassOpenTagPattern("div", "innerGroupBlock"))
      .slice(1);

    if (innerBlocks.length) {
      for (const innerBlock of innerBlocks) {
        const sectionTitle = cleanupImportedText(
          getFirstClassText(innerBlock, "innerGroupTitleText")
        );
        const sectionNotes = cleanupImportedText(
          getFirstClassText(innerBlock, "innerGroupNotes")
        );
        const tabs = extractTabsFromImportedMarkup(innerBlock);

        if (!tabs.length) {
          continue;
        }

        groups.push(
          buildImportedMarkupGroup({
            outerTitle,
            sectionTitle,
            notes: sectionNotes,
            createdAt,
            tabs
          })
        );
      }

      continue;
    }

    const tabs = extractTabsFromImportedMarkup(segment);

    if (!tabs.length) {
      continue;
    }

    groups.push(buildImportedMarkupGroup({ outerTitle, createdAt, tabs }));
  }

  if (!groups.length) {
    throw new Error("No saved tab groups were found in the selected HTML export");
  }

  return groups;
}

function isGroupImportCandidate(value) {
  return Boolean(value) && typeof value === "object" && Array.isArray(value.tabs);
}

function isTabImportCandidate(value) {
  return (
    typeof value === "string" ||
    (Boolean(value) &&
      typeof value === "object" &&
      (typeof value.url === "string" ||
        typeof value.pendingUrl === "string" ||
        typeof value.title === "string"))
  );
}

function normalizeImportedGroup(group) {
  return {
    ...group,
    title: group?.title || group?.name || group?.label || DEFAULT_GROUP_TITLE,
    notes:
      typeof group?.notes === "string"
        ? group.notes
        : typeof group?.notes?.text === "string"
          ? group.notes.text
          : "",
    tabs: Array.isArray(group?.tabs) ? group.tabs.map(normalizeImportedTab) : []
  };
}

function normalizeImportedTab(tab) {
  if (typeof tab === "string") {
    return {
      title: tab,
      url: tab,
      favIconUrl: ""
    };
  }

  return {
    ...tab,
    title: tab?.title || tab?.name || tab?.url || tab?.pendingUrl || "Untitled tab",
    url: tab?.url || tab?.pendingUrl || "",
    favIconUrl: tab?.favIconUrl || tab?.favicon || ""
  };
}

function cloneImportedGroupWithFreshIds(group) {
  const stamped = group?.createdAt || nowIso();

  return {
    ...group,
    id: createId("group"),
    createdAt: stamped,
    updatedAt: group?.updatedAt || stamped,
    tabs: Array.isArray(group?.tabs)
      ? group.tabs.map((tab) => ({
          ...tab,
          id: createId("tab"),
          addedAt: tab?.addedAt || stamped
        }))
      : []
  };
}

function extractTabsFromImportedMarkup(html) {
  const tabs = [];

  for (const [, attributes, label] of html.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/gi)) {
    if (!hasImportedHtmlClass(attributes, "tabLink")) {
      continue;
    }

    const href = decodeImportedEntities(getImportedHtmlAttribute(attributes, "href"));

    if (!href) {
      continue;
    }

    tabs.push({
      title: cleanupImportedText(label) || href,
      url: href,
      favIconUrl: ""
    });
  }

  return tabs;
}

function buildImportedMarkupGroup({ outerTitle = "", sectionTitle = "", notes = "", createdAt, tabs }) {
  const titleParts = [];

  if (outerTitle) {
    titleParts.push(outerTitle);
  }

  if (sectionTitle && sectionTitle !== outerTitle) {
    titleParts.push(sectionTitle);
  }

  return {
    title: titleParts.join(" / ") || deriveGroupTitle(tabs),
    notes,
    createdAt,
    updatedAt: createdAt,
    tabs
  };
}

function parseImportedCreatedAt(value) {
  const normalized = cleanupImportedText(value).replace(/^Created\s+/i, "");
  const parsedDate = new Date(normalized);

  return Number.isNaN(parsedDate.getTime()) ? nowIso() : parsedDate.toISOString();
}

function normalizeImportedHtmlTitle(value) {
  const normalized = cleanupImportedText(value);
  return /^\d+\s+tabs?$/i.test(normalized) ? "" : normalized;
}

function getFirstClassText(html, className) {
  const pattern = new RegExp(
    `<[^>]*class=(?:"[^"]*\\b${className}\\b[^"]*"|'[^']*\\b${className}\\b[^']*')[^>]*>([\\s\\S]*?)<\\/[^>]+>`,
    "i"
  );
  const match = html.match(pattern);
  return match?.[1] || "";
}

function buildImportedClassOpenTagPattern(tagName, className) {
  return new RegExp(
    `<${tagName}\\b[^>]*class=(?:"[^"]*\\b${className}\\b[^"]*"|'[^']*\\b${className}\\b[^']*')[^>]*>`,
    "i"
  );
}

function hasImportedHtmlClass(value, className) {
  return new RegExp(
    `class=(?:"[^"]*\\b${className}\\b[^"]*"|'[^']*\\b${className}\\b[^']*')`,
    "i"
  ).test(String(value ?? ""));
}

function getImportedHtmlAttribute(attributes, attributeName) {
  const match = String(attributes ?? "").match(
    new RegExp(`\\b${attributeName}=(?:"([^"]*)"|'([^']*)')`, "i")
  );
  return match?.[1] || match?.[2] || "";
}

function cleanupImportedText(value) {
  return decodeImportedEntities(stripImportedTags(value)).replace(/\s+/g, " ").trim();
}

function stripImportedTags(value) {
  return String(value ?? "").replace(/<[^>]+>/g, "");
}

function decodeImportedEntities(value) {
  return String(value ?? "")
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) => String.fromCodePoint(Number.parseInt(code, 16)))
    .replaceAll("&amp;", "&")
    .replaceAll("&quot;", "\"")
    .replaceAll("&#39;", "'")
    .replaceAll("&apos;", "'")
    .replaceAll("&lt;", "<")
    .replaceAll("&gt;", ">")
    .replaceAll("&nbsp;", " ");
}
