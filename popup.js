import {
  getHostname,
  isCollectorUrl,
  isRestrictedUrl,
  loadState,
  MESSAGE_TYPES,
  POPUP_ACTIONS,
  sortGroups
} from "./shared.js";
import { applyDocumentTheme } from "./theme.js";

const state = {
  settings: null,
  groups: [],
  tabs: [],
  selectedIds: new Set()
};

const destinationSelect = document.querySelector("#destination-select");
const groupTitleInput = document.querySelector("#group-title");
const headerSearchForm = document.querySelector("#header-search-form");
const headerSearchInput = document.querySelector("#header-search-input");
const selectionCount = document.querySelector("#selection-count");
const tabFilterInput = document.querySelector("#tab-filter");
const tabsList = document.querySelector("#tabs-list");
const quickList = document.querySelector("#quick-list");
const allowDuplicatesInput = document.querySelector("#allow-duplicates");
const includePinnedInput = document.querySelector("#include-pinned");
const statusNode = document.querySelector("#status");

await initialize();

document.addEventListener("click", handleClick);
document.addEventListener("change", handleChange);
document.addEventListener("keydown", handleKeyDown);
headerSearchForm.addEventListener("submit", handleHeaderSearchSubmit);
tabFilterInput.addEventListener("input", renderTabs);
destinationSelect.addEventListener("change", syncDestinationState);

async function initialize() {
  const [storedState, currentWindowTabs] = await Promise.all([
    loadState(),
    chrome.tabs.query({
      currentWindow: true
    })
  ]);

  state.settings = storedState.settings;
  state.groups = sortGroups(storedState.groups);
  state.tabs = currentWindowTabs
    .filter((tab) => typeof tab.id === "number")
    .sort((left, right) => left.index - right.index);
  state.selectedIds = getDefaultSelection(state.tabs);
  allowDuplicatesInput.checked = state.settings.duplicates === "allow";
  includePinnedInput.checked = state.settings.includePinned;
  applyDocumentTheme(state.settings);

  renderDestinationOptions();
  renderTabs();
  renderQuickList();
  syncQuickActions();
}

function getDefaultSelection(tabs) {
  const highlighted = tabs.filter((tab) => tab.highlighted);

  if (highlighted.length > 1) {
    return new Set(highlighted.map((tab) => tab.id));
  }

  const activeTab = tabs.find((tab) => tab.active);

  if (activeTab?.groupId >= 0) {
    return new Set(
      tabs.filter((tab) => tab.groupId === activeTab.groupId).map((tab) => tab.id)
    );
  }

  return new Set(tabs.map((tab) => tab.id));
}

function renderDestinationOptions() {
  destinationSelect.textContent = "";

  const newOption = document.createElement("option");
  newOption.value = "";
  newOption.textContent = "Create a new group";
  destinationSelect.append(newOption);

  for (const group of state.groups) {
    const option = document.createElement("option");
    option.value = group.id;
    option.textContent = `${group.title} (${group.tabs.length})`;
    destinationSelect.append(option);
  }

  syncDestinationState();
}

function renderTabs() {
  const query = tabFilterInput.value.trim().toLowerCase();
  tabsList.textContent = "";

  if (!state.tabs.length) {
    const empty = document.createElement("p");
    empty.className = "empty-copy";
    empty.textContent = "No tabs are available in the current window.";
    tabsList.append(empty);
    updateSelectionCount();
    return;
  }

  for (const tab of state.tabs) {
    const host = getHostname(tab.url || "");
    const matches =
      !query ||
      [tab.title, tab.url, host]
        .filter(Boolean)
        .some((value) => value.toLowerCase().includes(query));

    const row = document.createElement("label");
    row.className = "tab-option";
    row.dataset.hidden = String(!matches);
    row.innerHTML = `
      <input type="checkbox" data-tab-id="${tab.id}" ${state.selectedIds.has(tab.id) ? "checked" : ""} />
      <span class="tab-meta">
        <span class="tab-title">${escapeHtml(tab.title || tab.url || "Untitled tab")}</span>
        <span class="tab-url">${escapeHtml(host || tab.url || "No URL")}</span>
      </span>
      <span class="tab-badge">${tab.pinned ? "Pinned" : "Tab"}</span>
    `;
    tabsList.append(row);
  }

  updateSelectionCount();
}

function renderQuickList() {
  quickList.textContent = "";
  const topGroups = state.groups.slice(0, 4);

  if (!topGroups.length) {
    const empty = document.createElement("p");
    empty.className = "empty-copy";
    empty.textContent = "Nothing has been stored yet.";
    quickList.append(empty);
    return;
  }

  for (const group of topGroups) {
    const row = document.createElement("div");
    row.className = "quick-item";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(group.title)}</strong>
        <span>${group.tabs.length} tabs saved</span>
      </div>
      <button class="ghost-button" data-action="${POPUP_ACTIONS.OPEN_SAVED_GROUP}" data-search="${escapeAttribute(group.title)}" type="button">
        Open
      </button>
    `;
    quickList.append(row);
  }
}

function updateSelectionCount() {
  const selectedCount = [...state.selectedIds].filter((id) =>
    state.tabs.some((tab) => tab.id === id)
  ).length;
  selectionCount.textContent = `${selectedCount} selected`;
}

function syncDestinationState() {
  const usingExistingGroup = Boolean(destinationSelect.value);
  groupTitleInput.disabled = usingExistingGroup;
  groupTitleInput.placeholder = usingExistingGroup
    ? "Existing group selected"
    : "Optional title for the new group";
}

async function handleClick(event) {
  const action = event.target.closest("[data-action]")?.dataset.action;

  if (!action) {
    if (event.target.id === "store-selected") {
      await saveSelectedTabsFromPopup();
    }

    if (event.target.id === "open-options-header") {
      await chrome.runtime.openOptionsPage();
    }

    if (event.target.id === "select-visible") {
      toggleVisibleSelection(true);
    }

    if (event.target.id === "clear-selection") {
      toggleVisibleSelection(false);
    }

    return;
  }

  if (action === POPUP_ACTIONS.OPEN_COLLECTOR) {
    await sendMessage({
      type: MESSAGE_TYPES.OPEN_COLLECTOR,
      currentWindowId: state.tabs[0]?.windowId
    });
    window.close();
    return;
  }

  if (action === POPUP_ACTIONS.SAVE_WINDOW) {
    await sendMessage({
      type: MESSAGE_TYPES.SAVE_CURRENT_WINDOW,
      windowId: state.tabs[0]?.windowId
    });
    window.close();
    return;
  }

  if (action === POPUP_ACTIONS.SAVE_TAB) {
    const activeTab = state.tabs.find((tab) => tab.active);

    if (!activeTab) {
      return;
    }

    await sendMessage({
      type: MESSAGE_TYPES.SAVE_CURRENT_TAB,
      tabId: activeTab.id
    });
    window.close();
    return;
  }

  if (action === POPUP_ACTIONS.SAVE_GROUP) {
    const activeTab = state.tabs.find((tab) => tab.active);

    if (!activeTab?.id || activeTab.groupId === undefined || activeTab.groupId < 0) {
      setStatus("The active tab is not inside a tab group.");
      return;
    }

    const response = await sendMessage({
      type: MESSAGE_TYPES.SAVE_CURRENT_GROUP,
      tabId: activeTab.id
    });

    if (response.addedCount) {
      setStatus(
        `Stored ${response.addedCount} tab${response.addedCount === 1 ? "" : "s"} from the current group.`
      );
      window.close();
      return;
    }

    setStatus("No tabs were stored from the current group.");
    return;
  }

  if (action === POPUP_ACTIONS.EXCLUDE_SITE) {
    const activeTab = state.tabs.find((tab) => tab.active);
    const host = getExcludableHost(activeTab);

    if (!host || !activeTab?.url) {
      setStatus("The current page cannot be excluded.");
      return;
    }

    await sendMessage({
      type: MESSAGE_TYPES.EXCLUDE_DOMAIN,
      url: activeTab.url
    });
    setStatus(`${host} will now be skipped during future saves.`);
    return;
  }

  if (action === POPUP_ACTIONS.OPEN_OPTIONS) {
    await chrome.runtime.openOptionsPage();
    window.close();
    return;
  }

  if (action === POPUP_ACTIONS.OPEN_SAVED_GROUP) {
    await sendMessage({
      type: MESSAGE_TYPES.OPEN_COLLECTOR,
      search: event.target.dataset.search,
      currentWindowId: state.tabs[0]?.windowId
    });
    window.close();
  }
}

function handleChange(event) {
  if (!event.target.matches("input[type='checkbox'][data-tab-id]")) {
    return;
  }

  const tabId = Number(event.target.dataset.tabId);

  if (event.target.checked) {
    state.selectedIds.add(tabId);
  } else {
    state.selectedIds.delete(tabId);
  }

  updateSelectionCount();
}

function handleKeyDown(event) {
  if (event.key === "/" && !isTextInput(event.target)) {
    event.preventDefault();
    tabFilterInput.focus();
    tabFilterInput.select();
  }
}

function toggleVisibleSelection(checked) {
  for (const checkbox of tabsList.querySelectorAll("input[type='checkbox'][data-tab-id]")) {
    const row = checkbox.closest(".tab-option");

    if (row?.dataset.hidden === "true") {
      continue;
    }

    checkbox.checked = checked;
    const tabId = Number(checkbox.dataset.tabId);

    if (checked) {
      state.selectedIds.add(tabId);
    } else {
      state.selectedIds.delete(tabId);
    }
  }

  updateSelectionCount();
}

async function saveSelectedTabsFromPopup() {
  const tabIds = [...state.selectedIds];

  if (!tabIds.length) {
    setStatus("Select at least one tab.");
    return;
  }

  const response = await sendMessage({
    type: MESSAGE_TYPES.SAVE_SELECTED_TABS,
    tabIds,
    title: groupTitleInput.value,
    destinationGroupId: destinationSelect.value || undefined,
    allowDuplicates: allowDuplicatesInput.checked,
    includePinned: includePinnedInput.checked
  });

  if (response.addedCount) {
    setStatus(`Stored ${response.addedCount} tab${response.addedCount === 1 ? "" : "s"}.`);
    window.close();
    return;
  }

  setStatus("No tabs were stored. They may already be saved or filtered out.");
}

async function handleHeaderSearchSubmit(event) {
  event.preventDefault();

  await sendMessage({
    type: MESSAGE_TYPES.OPEN_COLLECTOR,
    search: headerSearchInput.value.trim(),
    currentWindowId: state.tabs[0]?.windowId
  });
  window.close();
}

function setStatus(message) {
  statusNode.textContent = message;
}

function syncQuickActions() {
  const activeTab = state.tabs.find((tab) => tab.active);
  const saveGroupButton = document.querySelector(`[data-action="${POPUP_ACTIONS.SAVE_GROUP}"]`);
  const excludeSiteButton = document.querySelector(`[data-action="${POPUP_ACTIONS.EXCLUDE_SITE}"]`);
  const groupDescription = saveGroupButton?.querySelector("small");
  const excludeDescription = excludeSiteButton?.querySelector("small");
  const excludableHost = getExcludableHost(activeTab);
  const hasActiveGroup = Boolean(activeTab && activeTab.groupId !== undefined && activeTab.groupId >= 0);

  if (saveGroupButton) {
    saveGroupButton.disabled = !hasActiveGroup;
  }

  if (groupDescription) {
    groupDescription.textContent = hasActiveGroup
      ? "Store every tab from the active Edge tab group"
      : "Available when the active tab is inside an Edge tab group";
  }

  if (excludeSiteButton) {
    excludeSiteButton.disabled = !excludableHost;
  }

  if (excludeDescription) {
    excludeDescription.textContent = excludableHost
      ? `Prevent ${excludableHost} from being stored in future saves`
      : "Unavailable for collector, internal, and unsupported pages";
  }
}

function getExcludableHost(tab) {
  const url = tab?.url || "";

  if (!url || isRestrictedUrl(url) || isCollectorUrl(url)) {
    return "";
  }

  return getHostname(url);
}

function isTextInput(target) {
  return target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll("\"", "&quot;")
    .replaceAll("'", "&#39;");
}

function escapeAttribute(value) {
  return escapeHtml(value).replaceAll("`", "");
}

function sendMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (!response?.ok) {
        reject(new Error(response?.error || "Request failed"));
        return;
      }

      resolve(response);
    });
  });
}
