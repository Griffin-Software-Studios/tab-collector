import {
  COMMAND_IDS,
  DEFAULT_OMNIBOX_SUGGESTION,
  CONTEXT_MENU_IDS,
  canDeleteSavedGroup,
  DEFAULT_GROUP_TITLE,
  DEFAULT_SETTINGS,
  ensureGroupShape,
  getCollectorUrl,
  getEligibleDestinationGroup,
  getHostname,
  isCollectorUrl,
  loadState,
  makeGroup,
  makeTabRecord,
  MESSAGE_TYPES,
  nowIso,
  saveState,
  TOOLBAR_ACTIONS,
  updateGroupTimestamp
} from "./shared.js";
import {
  buildGroupPinMutationPlan,
  buildNextGroupsAfterSave,
  isGroupSaveAvailable,
  prepareTabsForSave,
  selectTabsForWindowSave
} from "./background-logic.js";

let contextMenuSyncQueue = Promise.resolve();
let contextMenuSnapshot = {
  contextMenuEnabled: false,
  menus: [],
  saveCurrentGroupEnabled: false,
  updatedAt: null
};

const PAGE_CONTEXT_MENUS = Object.freeze([
  Object.freeze({
    id: CONTEXT_MENU_IDS.SAVE_CURRENT_TAB,
    title: "Save tab to Tab Collector",
    contexts: ["page"]
  }),
  Object.freeze({
    id: CONTEXT_MENU_IDS.SAVE_CURRENT_GROUP,
    title: "Save tab group to Tab Collector",
    contexts: ["page"],
    enabled: false
  }),
  Object.freeze({
    id: CONTEXT_MENU_IDS.SAVE_CURRENT_WINDOW,
    title: "Save current window to Tab Collector",
    contexts: ["page"]
  }),
  Object.freeze({
    id: CONTEXT_MENU_IDS.OPEN_COLLECTOR,
    title: "Open Tab Collector",
    contexts: ["page"]
  }),
  Object.freeze({
    id: CONTEXT_MENU_IDS.EXCLUDE_SITE,
    title: "Exclude website from Tab Collector",
    contexts: ["page"]
  })
]);

bootstrap();

chrome.runtime.onInstalled.addListener(async () => {
  await ensureDefaults();
  await syncActionPopup();
  await syncContextMenus();
});

chrome.runtime.onStartup.addListener(async () => {
  await ensureDefaults();
  await syncActionPopup();
  await syncContextMenus();

  const { settings } = await loadState();

  if (settings.startupBehavior === "open") {
    await openCollector();
  }
});

chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== "local" || !changes.settings) {
    return;
  }

  await syncActionPopup();
  await syncContextMenus();
});

chrome.tabs.onActivated.addListener(async () => {
  await syncContextMenuState();
});

chrome.tabs.onUpdated.addListener(async (_tabId, _changeInfo, tab) => {
  if (!tab.active) {
    return;
  }

  await syncContextMenuState(tab);
});

chrome.windows.onFocusChanged.addListener(async (windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    return;
  }

  await syncContextMenuState();
});

if (chrome.tabGroups?.onCreated) {
  chrome.tabGroups.onCreated.addListener(async () => {
    await syncContextMenuState();
  });
  chrome.tabGroups.onRemoved.addListener(async () => {
    await syncContextMenuState();
  });
  chrome.tabGroups.onUpdated.addListener(async () => {
    await syncContextMenuState();
  });
}

chrome.action.onClicked.addListener(async (tab) => {
  const { settings } = await loadState();

  if (settings.toolbarAction === TOOLBAR_ACTIONS.SAVE_WINDOW) {
    await saveCurrentWindow({
      windowId: tab.windowId
    });
    return;
  }

  if (settings.toolbarAction === TOOLBAR_ACTIONS.SAVE_CURRENT) {
    await saveCurrentTab({
      tabId: tab.id
    });
    return;
  }

  await openCollector({
    currentWindowId: tab.windowId
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === CONTEXT_MENU_IDS.OPEN_COLLECTOR) {
    await openCollector({
      currentWindowId: tab?.windowId
    });
    return;
  }

  if (info.menuItemId === CONTEXT_MENU_IDS.SAVE_CURRENT_WINDOW && tab?.windowId !== undefined) {
    await saveCurrentWindow({
      windowId: tab.windowId
    });
    return;
  }

  if (info.menuItemId === CONTEXT_MENU_IDS.SAVE_CURRENT_TAB && tab?.id !== undefined) {
    await saveCurrentTab({
      tabId: tab.id
    });
    return;
  }

  if (info.menuItemId === CONTEXT_MENU_IDS.SAVE_CURRENT_GROUP && tab?.id !== undefined) {
    await saveCurrentGroup({
      tabId: tab.id
    });
    return;
  }

  if (info.menuItemId === CONTEXT_MENU_IDS.EXCLUDE_SITE) {
    const pageUrl = info.pageUrl || tab?.url;
    await excludeDomainFromUrl(pageUrl);
  }
});

chrome.commands.onCommand.addListener(async (command) => {
  if (command === COMMAND_IDS.SAVE_CURRENT_TAB) {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    if (activeTab?.id !== undefined) {
      await saveCurrentTab({
        tabId: activeTab.id
      });
    }

    return;
  }

  if (command === COMMAND_IDS.OPEN_COLLECTOR) {
    const [activeTab] = await chrome.tabs.query({
      active: true,
      currentWindow: true
    });

    await openCollector({
      currentWindowId: activeTab?.windowId
    });
  }
});

chrome.omnibox.onInputChanged.addListener(async (text, suggest) => {
  syncOmniboxSuggestion();
  const query = text.trim().toLowerCase();
  const { groups } = await loadState();
  const suggestions = groups
    .filter((group) => {
      if (!query) {
        return true;
      }

      return group.title.toLowerCase().includes(query);
    })
    .slice(0, 5)
    .map((group) => ({
      content: group.title,
      description: `${group.title} (${group.tabs.length} tabs)`
    }));

  suggest(suggestions);
});

chrome.omnibox.onInputEntered.addListener(async (text) => {
  await openCollector({
    search: text.trim()
  });
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  handleMessage(message, sender)
    .then((result) => sendResponse({ ok: true, ...result }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});

async function bootstrap() {
  await ensureDefaults();
  await syncActionPopup();
  await syncContextMenus();
  syncOmniboxSuggestion();
}

function syncOmniboxSuggestion() {
  chrome.omnibox.setDefaultSuggestion({
    description: DEFAULT_OMNIBOX_SUGGESTION
  });
}

async function ensureDefaults() {
  const state = await loadState();

  await chrome.storage.local.set({
    settings: {
      ...DEFAULT_SETTINGS,
      ...state.settings
    },
    groups: state.groups.map(ensureGroupShape),
    excludedDomains: state.excludedDomains
  });
}

async function syncActionPopup() {
  const { settings } = await loadState();

  await chrome.action.setPopup({
    popup: settings.toolbarAction === TOOLBAR_ACTIONS.POPUP ? "popup.html" : ""
  });
}

async function syncContextMenus() {
  contextMenuSyncQueue = contextMenuSyncQueue
    .catch(() => {})
    .then(() => performContextMenuSync());

  return contextMenuSyncQueue;
}

async function performContextMenuSync() {
  const { settings } = await loadState();
  await chrome.contextMenus.removeAll();

  if (!settings.contextMenuEnabled) {
    contextMenuSnapshot = {
      contextMenuEnabled: false,
      menus: [],
      saveCurrentGroupEnabled: false,
      updatedAt: nowIso()
    };
    return;
  }

  for (const menu of PAGE_CONTEXT_MENUS) {
    await createMenu({
      id: menu.id,
      title: menu.title,
      contexts: menu.contexts,
      enabled: menu.enabled
    });
  }

  contextMenuSnapshot = {
    contextMenuEnabled: true,
    menus: PAGE_CONTEXT_MENUS.map((menu) => ({
      id: menu.id,
      title: menu.title,
      contexts: [...menu.contexts]
    })),
    saveCurrentGroupEnabled: false,
    updatedAt: nowIso()
  };

  await performContextMenuStateSync();
}

function syncContextMenuState(tab) {
  contextMenuSyncQueue = contextMenuSyncQueue
    .catch(() => {})
    .then(() => performContextMenuStateSync(tab));

  return contextMenuSyncQueue;
}

async function performContextMenuStateSync(tab) {
  const { settings } = await loadState();

  if (!settings.contextMenuEnabled) {
    return;
  }

  const activeTab = tab?.active ? tab : await getFocusedActiveTab();
  const groupSaveEnabled = isGroupSaveAvailable(activeTab);

  try {
    await chrome.contextMenus.update(CONTEXT_MENU_IDS.SAVE_CURRENT_GROUP, {
      enabled: groupSaveEnabled
    });
    contextMenuSnapshot = {
      ...contextMenuSnapshot,
      saveCurrentGroupEnabled: groupSaveEnabled,
      updatedAt: nowIso()
    };
  } catch {
    return;
  }
}

function createMenu(options) {
  return new Promise((resolve, reject) => {
    chrome.contextMenus.create(options, () => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      resolve();
    });
  });
}

async function handleMessage(message, sender) {
  switch (message?.type) {
    case MESSAGE_TYPES.OPEN_COLLECTOR:
      await openCollector({
        search: message.search || "",
        currentWindowId: message.currentWindowId ?? sender?.tab?.windowId
      });
      return {};
    case MESSAGE_TYPES.GET_CONTEXT_MENU_DIAGNOSTICS:
      return getContextMenuDiagnostics();
    case MESSAGE_TYPES.SAVE_CURRENT_WINDOW:
      return saveCurrentWindow(message);
    case MESSAGE_TYPES.SAVE_CURRENT_TAB:
      return saveCurrentTab(message);
    case MESSAGE_TYPES.SAVE_CURRENT_GROUP:
      return saveCurrentGroup(message);
    case MESSAGE_TYPES.SAVE_SELECTED_TABS:
      return saveSelectedTabs(message);
    case MESSAGE_TYPES.RESTORE_GROUP:
      return restoreGroup(message, sender);
    case MESSAGE_TYPES.RESTORE_TAB:
      return restoreTab(message, sender);
    case MESSAGE_TYPES.TOGGLE_GROUP_FLAG:
      return toggleGroupFlag(message, sender);
    case MESSAGE_TYPES.RENAME_GROUP:
      return renameGroup(message);
    case MESSAGE_TYPES.UPDATE_GROUP_NOTES:
      return updateGroupNotes(message);
    case MESSAGE_TYPES.DELETE_GROUP:
      return deleteGroup(message);
    case MESSAGE_TYPES.DELETE_TAB:
      return deleteTab(message);
    case MESSAGE_TYPES.EXCLUDE_DOMAIN:
      await excludeDomainFromUrl(message.url || `https://${message.domain}`);
      return {};
    default:
      throw new Error(`Unsupported message type: ${message?.type || "unknown"}`);
  }
}

async function getContextMenuDiagnostics() {
  await syncContextMenus();

  const registeredMenuIds = contextMenuSnapshot.menus.map((menu) => menu.id);
  const expectedMenuIds = Object.values(CONTEXT_MENU_IDS);
  const pageOnlyContexts = contextMenuSnapshot.menus.every((menu) =>
    Array.isArray(menu.contexts) &&
    menu.contexts.length === 1 &&
    menu.contexts[0] === "page"
  );

  return {
    contextMenuEnabled: contextMenuSnapshot.contextMenuEnabled,
    expectedMenuIds,
    registeredMenuIds,
    pageOnlyContexts,
    saveCurrentGroupEnabled: contextMenuSnapshot.saveCurrentGroupEnabled,
    snapshotUpdatedAt: contextMenuSnapshot.updatedAt
  };
}

async function openCollector({ search = "", currentWindowId } = {}) {
  const { settings } = await loadState();
  const collectorTabs = await getCollectorTabs();
  const targetUrl = getCollectorUrl(search);

  if (!collectorTabs.length) {
    await chrome.tabs.create(
      currentWindowId !== undefined
        ? {
            windowId: currentWindowId,
            url: targetUrl
          }
        : {
            url: targetUrl
          }
    );
    return;
  }

  let existingTab = collectorTabs[0];

  if (settings.openAction === "move" && currentWindowId !== undefined && existingTab.windowId !== currentWindowId) {
    existingTab = await chrome.tabs.move(existingTab.id, {
      windowId: currentWindowId,
      index: -1
    });
  }

  if (search && existingTab.url !== targetUrl) {
    existingTab = await chrome.tabs.update(existingTab.id, {
      url: targetUrl
    });
  }

  await chrome.windows.update(existingTab.windowId, {
    focused: true
  });
  await chrome.tabs.update(existingTab.id, {
    active: true
  });
}

async function getCollectorTabs() {
  const tabs = await chrome.tabs.query({});
  return tabs.filter((tab) => isCollectorUrl(tab.url || ""));
}

async function saveCurrentWindow({ windowId, title = "", allowDuplicates, includePinned } = {}) {
  if (windowId === undefined) {
    throw new Error("windowId is required");
  }

  const tabs = await getTabsForWindowSave(windowId);
  return saveTabsToCollector(tabs, {
    title,
    allowDuplicates,
    includePinned
  });
}

async function saveCurrentTab({ tabId } = {}) {
  if (tabId === undefined) {
    throw new Error("tabId is required");
  }

  const tab = await chrome.tabs.get(tabId);
  const state = await loadState();
  const destination = getEligibleDestinationGroup(state.groups);

  return saveTabsToCollector([tab], {
    destinationGroupId: destination?.id
  });
}

async function saveCurrentGroup({ tabId } = {}) {
  if (tabId === undefined) {
    throw new Error("tabId is required");
  }

  const tab = await chrome.tabs.get(tabId);

  if (tab.groupId === undefined || tab.groupId < 0) {
    throw new Error("The current tab is not inside a tab group");
  }

  const tabs = await chrome.tabs.query({
    windowId: tab.windowId
  });
  const groupedTabs = tabs
    .filter((candidate) => candidate.groupId === tab.groupId)
    .sort((left, right) => left.index - right.index);

  return saveTabsToCollector(groupedTabs);
}

async function saveSelectedTabs({
  tabIds = [],
  title = "",
  allowDuplicates,
  includePinned,
  destinationGroupId
} = {}) {
  if (!tabIds.length) {
    throw new Error("Select at least one tab");
  }

  const tabs = (
    await Promise.all(
      tabIds.map(async (tabId) => {
        try {
          return await chrome.tabs.get(tabId);
        } catch {
          return null;
        }
      })
    )
  ).filter(Boolean);

  return saveTabsToCollector(tabs, {
    title,
    allowDuplicates,
    includePinned,
    destinationGroupId
  });
}

async function saveTabsToCollector(
  tabs,
  { title = "", allowDuplicates, includePinned, destinationGroupId } = {}
) {
  const state = await loadState();
  const includePinnedTabs =
    typeof includePinned === "boolean" ? includePinned : state.settings.includePinned;
  const allowDuplicateTabs =
    typeof allowDuplicates === "boolean"
      ? allowDuplicates
      : state.settings.duplicates === "allow";
  const { eligibleTabs, skippedCount } = prepareTabsForSave(tabs, {
    groups: state.groups,
    excludedDomains: state.excludedDomains,
    includePinnedTabs,
    allowDuplicateTabs,
    isExcludedUrl
  });

  if (!eligibleTabs.length) {
    return {
      addedCount: 0,
      skippedCount
    };
  }

  const saveResult = buildNextGroupsAfterSave(state.groups, eligibleTabs, {
    destinationGroupId,
    title,
    makeGroup,
    makeTabRecord,
    updateGroupTimestamp
  });
  state.groups = saveResult.groups;
  await saveState(state);
  await chrome.tabs.remove(eligibleTabs.map((tab) => tab.id));

  return {
    addedCount: eligibleTabs.length,
    skippedCount,
    groupId: saveResult.groupId
  };
}

async function getTabsForWindowSave(windowId) {
  const tabs = await chrome.tabs.query({
    windowId
  });
  return selectTabsForWindowSave(tabs);
}

async function getFocusedActiveTab() {
  const [activeTab] = await chrome.tabs.query({
    active: true,
    lastFocusedWindow: true
  });

  return activeTab || null;
}

function isExcludedUrl(url, excludedDomains) {
  const host = getHostname(url);
  return host ? excludedDomains.includes(host) : false;
}

async function restoreGroup(message, sender) {
  const state = await loadState();
  const group = state.groups.find((item) => item.id === message.groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  const archive = Boolean(message.archive);
  const keepTabs = Boolean(message.keepTabs) || archive || group.locked;
  await openStoredTabs(group.tabs, {
    active: Boolean(message.active),
    newWindow: message.target === "new-window",
    sourceWindowId: sender?.tab?.windowId,
    sourceTabIndex: sender?.tab?.index,
    pinned: group.pinned
  });

  if (archive) {
    group.archived = true;
  }

  if (!keepTabs && !group.locked) {
    state.groups = state.groups.filter((item) => item.id !== group.id);
  } else {
    updateGroupTimestamp(group);
  }

  await saveState(state);
  return {
    restoredCount: group.tabs.length
  };
}

async function restoreTab(message, sender) {
  const state = await loadState();
  const group = state.groups.find((item) => item.id === message.groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  const tab = group.tabs.find((item) => item.id === message.tabId);

  if (!tab) {
    throw new Error("Tab not found");
  }

  const archive = Boolean(message.archive);
  const keepTabs = Boolean(message.keepTabs) || archive || group.locked;
  await openStoredTabs([tab], {
    active: Boolean(message.active),
    newWindow: Boolean(message.newWindow),
    sourceWindowId: sender?.tab?.windowId,
    sourceTabIndex: sender?.tab?.index,
    pinned: group.pinned
  });

  if (archive) {
    group.archived = true;
  }

  if (!keepTabs && !group.locked) {
    group.tabs = group.tabs.filter((item) => item.id !== tab.id);
  }

  if (!group.tabs.length) {
    state.groups = state.groups.filter((item) => item.id !== group.id);
  } else {
    updateGroupTimestamp(group);
  }

  await saveState(state);
  return {
    restoredCount: 1
  };
}

async function openStoredTabs(
  tabs,
  { active = false, newWindow = false, sourceWindowId, sourceTabIndex = 0, pinned = false } = {}
) {
  const createdTabs = [];

  if (!tabs.length) {
    return createdTabs;
  }

  if (newWindow) {
    const [firstTab, ...rest] = tabs;
    const createdWindow = await chrome.windows.create({
      url: firstTab.url,
      focused: active
    });

    if (createdWindow.tabs?.length) {
      const firstCreated = pinned
        ? await chrome.tabs.update(createdWindow.tabs[0].id, {
            pinned: true,
            active
          })
        : createdWindow.tabs[0];
      createdTabs.push(firstCreated);
    }

    for (const tab of rest) {
      const created = await chrome.tabs.create({
        windowId: createdWindow.id,
        url: tab.url,
        pinned,
        active: false
      });
      createdTabs.push(created);
    }
  } else {
    const targetWindowId = await resolvePreferredWindowId(sourceWindowId);
    let insertionIndex = (sourceTabIndex ?? 0) + 1;

    if (pinned) {
      const existingTabs = await chrome.tabs.query({
        windowId: targetWindowId
      });
      insertionIndex = existingTabs.filter((tab) => tab.pinned).length;
    }

    for (let index = 0; index < tabs.length; index += 1) {
      const created = await chrome.tabs.create({
        windowId: targetWindowId,
        url: tabs[index].url,
        index: insertionIndex + index,
        pinned,
        active: active && index === tabs.length - 1
      });
      createdTabs.push(created);
    }
  }

  const { settings } = await loadState();

  if (settings.saveMemoryOnRestore) {
    await Promise.all(
      createdTabs
        .filter((tab) => !tab.active)
        .map(async (tab) => {
          try {
            await chrome.tabs.discard(tab.id);
          } catch {
            return null;
          }
          return null;
        })
    );
  }

  return createdTabs;
}

async function toggleGroupFlag({ groupId, flag }, sender) {
  if (!["archived", "locked", "pinned"].includes(flag)) {
    throw new Error("Unsupported flag");
  }

  const state = await loadState();
  const group = state.groups.find((item) => item.id === groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  const nextValue = !group[flag];

  if (flag === "pinned") {
    await syncGroupPinnedTabs(group.tabs, nextValue, {
      preferredWindowId: sender?.tab?.windowId
    });
  }

  group[flag] = nextValue;

  if (flag !== "pinned") {
    updateGroupTimestamp(group);
  }

  await saveState(state);

  return {
    value: group[flag]
  };
}

async function syncGroupPinnedTabs(groupTabs, pinned, { preferredWindowId } = {}) {
  const candidateTabs = pinned
    ? await chrome.tabs.query({
        windowId: await resolvePreferredWindowId(preferredWindowId)
      })
    : await chrome.tabs.query({
        pinned: true
      });
  const { tabsToUpdate, tabsToCreate, tabsToRemove } = buildGroupPinMutationPlan(
    groupTabs,
    candidateTabs,
    {
      pinned
    }
  );

  if (!pinned) {
    if (!tabsToRemove.length) {
      return;
    }

    await Promise.all(
      tabsToRemove
        .filter((tab) => tab && typeof tab.id === "number")
        .map((tab) => chrome.tabs.remove(tab.id))
    );
    return;
  }

  await Promise.all(
    tabsToUpdate
      .filter((tab) => tab && typeof tab.id === "number" && tab.pinned !== pinned)
      .map((tab) =>
        chrome.tabs.update(tab.id, {
          pinned
        })
      )
  );

  if (!tabsToCreate.length) {
    return;
  }

  const windowId = await resolvePreferredWindowId(preferredWindowId);
  const refreshedTabs = await chrome.tabs.query({
    windowId
  });
  let insertionIndex = refreshedTabs.filter((tab) => tab.pinned).length;

  for (const tab of tabsToCreate) {
    await chrome.tabs.create({
      windowId,
      url: tab.url,
      index: insertionIndex,
      pinned: true,
      active: false
    });
    insertionIndex += 1;
  }
}

async function resolvePreferredWindowId(preferredWindowId) {
  if (typeof preferredWindowId === "number") {
    return preferredWindowId;
  }

  const activeTab = await getFocusedActiveTab();

  if (typeof activeTab?.windowId === "number") {
    return activeTab.windowId;
  }

  const focusedWindow = await chrome.windows.getLastFocused();

  if (typeof focusedWindow?.id === "number") {
    return focusedWindow.id;
  }

  throw new Error("No target window available");
}

async function renameGroup({ groupId, title }) {
  const state = await loadState();
  const group = state.groups.find((item) => item.id === groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  group.title = title?.trim() || DEFAULT_GROUP_TITLE;
  updateGroupTimestamp(group);
  await saveState(state);
  return {};
}

async function updateGroupNotes({ groupId, notes }) {
  const state = await loadState();
  const group = state.groups.find((item) => item.id === groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  group.notes = notes || "";
  updateGroupTimestamp(group);
  await saveState(state);
  return {};
}

async function deleteGroup({ groupId }) {
  const state = await loadState();
  const group = state.groups.find((item) => item.id === groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!canDeleteSavedGroup(group)) {
    throw new Error("Locked groups cannot be deleted");
  }

  state.groups = state.groups.filter((item) => item.id !== groupId);
  await saveState(state);
  return {};
}

async function deleteTab({ groupId, tabId }) {
  const state = await loadState();
  const group = state.groups.find((item) => item.id === groupId);

  if (!group) {
    throw new Error("Group not found");
  }

  if (!canDeleteSavedGroup(group)) {
    throw new Error("Locked groups cannot remove tabs");
  }

  group.tabs = group.tabs.filter((item) => item.id !== tabId);

  if (!group.tabs.length) {
    state.groups = state.groups.filter((item) => item.id !== groupId);
  } else {
    updateGroupTimestamp(group);
  }

  await saveState(state);
  return {};
}

async function excludeDomainFromUrl(url) {
  if (!url) {
    return;
  }

  const host = getHostname(url);

  if (!host) {
    return;
  }

  const state = await loadState();

  if (!state.excludedDomains.includes(host)) {
    state.excludedDomains.push(host);
    state.excludedDomains.sort();
    await saveState(state);
  }
}
