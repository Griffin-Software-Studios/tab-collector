import {
  canDeleteSavedGroup,
  buildClipboardPayload,
  formatUrlForDisplay,
  loadState,
  saveState,
  sortGroups
} from "./shared.js";
import {
  THEMES,
  applyDocumentTheme,
  formatThemeLabel,
  getTheme,
  normalizeTheme,
  normalizeThemeMode
} from "./theme.js";
import {
  COLLECTOR_EXPORT_FORMATS,
  getDuplicateTabPreview,
  getCollectorFaviconFallback,
  getCollectorSummary,
  getNextFocusIndex,
  getRestoreBehavior,
  removeSelectedTabsFromGroups,
  serializeGroupsAsCsv,
  serializeGroupsAsHtml,
  serializeGroupsAsJson
} from "./collector-logic.js";

const state = {
  settings: null,
  groups: [],
  filter: "",
  exportFormat: COLLECTOR_EXPORT_FORMATS.HTML
};
let pendingConfirmation = null;

const contentArea = document.querySelector("#contentAreaDiv");
const loadingSpinner = document.querySelector("#loadingSpinner");
const nodes = {
  searchInput: null,
  themeSelect: null,
  themeModeSelect: null,
  exportFormatSelect: null,
  groupsRoot: null,
  statusNode: null,
  groupCountNode: null,
  tabCountNode: null,
  searchSummaryNode: null,
  confirmOverlay: null,
  confirmTitleNode: null,
  confirmBodyNode: null,
  confirmExtraNode: null,
  confirmActionButton: null,
  confirmCancelButton: null
};

await initialize();

document.addEventListener("click", handleClick);
document.addEventListener("change", handleChange);
document.addEventListener("keydown", handleKeyDown);
document.addEventListener("blur", handleBlur, true);
document.addEventListener("dragstart", handleDragStart);
chrome.storage.onChanged.addListener(async (changes, areaName) => {
  if (areaName !== "local") {
    return;
  }

  if (changes.groups || changes.settings || changes.excludedDomains) {
    await refreshState({
      preserveViewport: true
    });
  }
});

async function initialize() {
  renderShell();
  const params = new URLSearchParams(window.location.search);
  state.filter = params.get("search") || "";
  nodes.searchInput.value = state.filter;
  nodes.searchInput.addEventListener("input", handleSearchInput);
  nodes.themeSelect.addEventListener("change", handleThemeChange);
  nodes.themeModeSelect.addEventListener("change", handleThemeModeChange);
  nodes.exportFormatSelect.value = state.exportFormat;
  nodes.exportFormatSelect.addEventListener("change", handleExportFormatChange);
  await refreshState({
    showLoadingState: true
  });
}

function renderShell() {
  const themeOptionsMarkup = THEMES.map(
    (theme) => `<option value="${escapeAttribute(theme.id)}">${escapeHtml(theme.label)}</option>`
  ).join("");
  contentArea.innerHTML = `
    <div id="centerColItems" class="collector-page">
      <div id="landingDiv" class="fade-in">
        <div class="collector-toolbar-row">
          <div class="collector-brand">
            <div class="collector-brand-lockup">
              <img
                class="collector-logo"
                src="assets/brand/tab-collector-128.png"
                alt="Tab Collector logo"
              />
              <div class="collector-brand-copy">
                <p class="collector-eyebrow">Tab Collector</p>
                <h1 class="collector-heading">Saved tabs, grouped for later</h1>
              </div>
            </div>
            <div class="collector-subtitle">
              Restore tabs using your configured options. Hold <x-key>Ctrl</x-key> or
              <x-key>Cmd</x-key> to keep restored tabs in the list, hold <x-key>Alt</x-key>
              or <x-key>Option</x-key> to archive them, and hold <x-key>Shift</x-key> when
              opening a tab to restore it in a new window.
            </div>
          </div>
          <div class="collector-header-controls">
            <div class="collector-input-grid">
              <label class="collector-search-field">
                <span class="tree-item-text">Search saved tabs</span>
                <input id="search-input" type="text" placeholder="Press / to focus" />
              </label>
              <label class="collector-theme-field">
                <span class="tree-item-text">Theme</span>
                <select id="theme-select">
                  ${themeOptionsMarkup}
                </select>
              </label>
              <label class="collector-theme-mode-field">
                <span class="tree-item-text">Appearance</span>
                <select id="theme-mode-select">
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </label>
            </div>
            <div class="collector-header-buttons">
              <label class="collector-export-field">
                <span class="tree-item-text">Export format</span>
                <select id="export-format">
                  <option value="html">HTML</option>
                  <option value="json">JSON</option>
                  <option value="csv">Comma-delimited</option>
                </select>
              </label>
              <button
                id="export-all"
                class="controlButton headerControl collector-success-action"
                type="button"
              >
                Export all
              </button>
              <button
                id="remove-duplicates"
                class="controlButton headerControl collector-success-action"
                type="button"
              >
                Remove duplicates
              </button>
              <button id="clear-search" class="controlButton headerControl" type="button">
                Clear
              </button>
              <button
                id="open-options"
                class="controlButton headerControl collector-primary-action"
                type="button"
              >
                Options
              </button>
            </div>
            <p id="status" class="collector-status collector-header-status" role="status"></p>
          </div>
        </div>

        <div class="collector-summary-row">
          <div class="collector-summary-card">
            <div class="tree-item-text">Groups</div>
            <div id="group-count" class="collector-summary-value">0</div>
          </div>
          <div class="collector-summary-card">
            <div class="tree-item-text">Tabs</div>
            <div id="tab-count" class="collector-summary-value">0</div>
          </div>
          <div class="collector-summary-card">
            <div class="tree-item-text">Current search</div>
            <div id="search-summary" class="collector-summary-value collector-summary-search">
              All saved tabs
            </div>
          </div>
        </div>
      </div>
      <section id="groups-root" class="collector-groups" aria-live="polite"></section>

      <div
        id="confirm-overlay"
        class="collector-confirm-overlay"
        role="presentation"
        hidden
      >
        <div
          class="collector-confirm-card"
          role="alertdialog"
          aria-modal="true"
          aria-labelledby="confirm-title"
          aria-describedby="confirm-body"
        >
          <p class="collector-confirm-kicker">Confirm delete</p>
          <h2 id="confirm-title" class="collector-confirm-title">Delete this item?</h2>
          <p id="confirm-body" class="collector-confirm-body">
            This action removes the saved item from Tab Collector.
          </p>
          <div id="confirm-extra" class="collector-confirm-extra" hidden></div>
          <div class="collector-confirm-actions">
            <button
              id="confirm-cancel"
              class="controlButton"
              type="button"
            >
              Cancel
            </button>
            <button
              id="confirm-delete"
              class="controlButton red"
              type="button"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  `;

  nodes.searchInput = document.querySelector("#search-input");
  nodes.themeSelect = document.querySelector("#theme-select");
  nodes.themeModeSelect = document.querySelector("#theme-mode-select");
  nodes.exportFormatSelect = document.querySelector("#export-format");
  nodes.groupsRoot = document.querySelector("#groups-root");
  nodes.statusNode = document.querySelector("#status");
  nodes.groupCountNode = document.querySelector("#group-count");
  nodes.tabCountNode = document.querySelector("#tab-count");
  nodes.searchSummaryNode = document.querySelector("#search-summary");
  nodes.confirmOverlay = document.querySelector("#confirm-overlay");
  nodes.confirmTitleNode = document.querySelector("#confirm-title");
  nodes.confirmBodyNode = document.querySelector("#confirm-body");
  nodes.confirmExtraNode = document.querySelector("#confirm-extra");
  nodes.confirmActionButton = document.querySelector("#confirm-delete");
  nodes.confirmCancelButton = document.querySelector("#confirm-cancel");
}

async function refreshState({ showLoadingState = false, preserveViewport = false } = {}) {
  const viewState = preserveViewport ? captureViewState() : null;

  if (showLoadingState) {
    showLoading(true);
  }

  try {
    const storedState = await loadState();
    state.settings = storedState.settings;
    state.groups = sortGroups(storedState.groups);
    syncThemeControls();
    applyTheme(state.settings);
    render();

    if (viewState) {
      await restoreViewState(viewState);
    }
  } finally {
    if (showLoadingState) {
      showLoading(false);
    }
  }
}

function render() {
  const summary = getCollectorSummary(state.groups, state.filter);
  const { visibleGroups } = summary;
  nodes.groupCountNode.textContent = String(summary.groupCount);
  nodes.tabCountNode.textContent = String(summary.tabCount);
  nodes.searchSummaryNode.textContent = formatSearchSummary(state.filter);
  nodes.groupsRoot.textContent = "";

  if (!visibleGroups.length) {
    const empty = document.createElement("section");
    empty.className = "empty-state tabGroupBody";
    empty.innerHTML = `
      <div class="tabGroupLabelText">No matching groups</div>
      <div class="collector-subtitle">
        Try a different search, or store tabs from the toolbar popup.
      </div>
    `;
    nodes.groupsRoot.append(empty);
    return;
  }

  for (const group of visibleGroups) {
    nodes.groupsRoot.append(buildGroupCard(group));
  }
}

function buildGroupCard(group) {
  const deleteAllowed = canDeleteSavedGroup(group);
  const searchContextMarkup = buildGroupSearchContextMarkup(group, state.filter);
  const deleteButtonMarkup = deleteAllowed
    ? `<button class="controlButton red" data-action="delete-group" type="button">
            Delete
          </button>`
    : "";

  const section = document.createElement("section");
  section.className = `tabGroup${group.archived ? " archived" : ""}`;
  section.dataset.groupId = group.id;
  section.innerHTML = `
    <div class="tabGroupBody collector-tab-group-body" data-group-id="${group.id}" tabindex="0">
      <div class="collector-group-header">
        <div class="collector-group-copy">
          <input
            class="collector-group-title-input tabGroupLabelText"
            data-role="group-title"
            value="${escapeAttribute(group.title)}"
          />
          <div class="collector-group-meta">
            <span class="multiple-choice-button on">${group.tabs.length} tabs</span>
            <span class="selectable-item on">${formatDate(group.updatedAt || group.createdAt)}</span>
            ${group.archived ? '<span class="multiple-choice-button on">Archived</span>' : ""}
            ${group.locked ? '<span class="multiple-choice-button on">Locked</span>' : ""}
            ${group.pinned ? '<span class="multiple-choice-button on">Pinned</span>' : ""}
          </div>
        </div>
        <div class="collector-group-actions">
          <button class="controlButton collector-primary-action" data-action="restore-group" type="button">
            Restore
          </button>
          <button class="controlButton" data-action="copy-group" type="button">Copy</button>
          <button class="controlButton collector-success-action" data-action="export-group" type="button">
            Export
          </button>
          <button class="controlButton" data-action="toggle-archive" type="button">
            ${group.archived ? "Unarchive" : "Archive"}
          </button>
          <button class="controlButton" data-action="toggle-pin" type="button">
            ${group.pinned ? "Unpin" : "Pin"}
          </button>
          <button class="controlButton" data-action="toggle-lock" type="button">
            ${group.locked ? "Unlock" : "Lock"}
          </button>
          ${deleteButtonMarkup}
        </div>
      </div>

      <label class="collector-notes-shell">
        <span class="tree-item-text">Notes</span>
        <textarea
          class="collector-notes-input"
          data-role="group-notes"
          data-group-id="${group.id}"
          placeholder="Use Ctrl+Enter or Cmd+Enter to save notes quickly."
        >${escapeHtml(group.notes)}</textarea>
      </label>

      ${searchContextMarkup}

      <div class="treeChildrenContainer collector-tabs">
        ${group.tabs.map((tab) => buildTabMarkup(group, tab)).join("")}
      </div>
    </div>
  `;

  return section;
}

function buildTabMarkup(group, tab) {
  const displayUrl = formatUrlForDisplay(tab.url, state.settings.urlDisplay);
  const deleteAllowed = canDeleteSavedGroup(group);
  const highlightedTitle = highlightSearchText(tab.title, state.filter);
  const highlightedUrl = displayUrl ? highlightSearchText(displayUrl, state.filter) : "";
  const removeButtonMarkup = deleteAllowed
    ? `<button
          class="controlButton red collector-remove-button"
          data-action="delete-tab"
          type="button"
        >
          Remove
        </button>`
    : "";

  return `
    <div class="tab${group.archived ? " archived" : ""}" data-group-id="${group.id}" data-tab-id="${tab.id}" tabindex="0" draggable="true">
      <div class="tabInner">
        <button
          class="flag tabTickImg collector-restore-button"
          data-action="restore-tab"
          type="button"
          title="Open tab"
        >
          Go
        </button>
        <div class="favIconDiv">
          ${
            tab.favIconUrl
              ? `<img class="collector-favicon" src="${escapeAttribute(tab.favIconUrl)}" alt="" />`
              : `<span class="collector-favicon-fallback">${escapeHtml(
                  getCollectorFaviconFallback(tab)
                )}</span>`
          }
        </div>
        <a class="tabLink" href="${escapeAttribute(tab.url)}" data-action="restore-tab">
          <span class="tabLinkText tabLinkTextStripesPossible">${highlightedTitle}</span>
        </a>
        ${removeButtonMarkup}
      </div>
      ${
        displayUrl
          ? `<div class="tabUrl oneLineWithEllipsis"><span class="tabUrlText">${highlightedUrl}</span></div>`
          : ""
      }
    </div>
  `;
}

async function handleClick(event) {
  const clickedButton = event.target.closest("button");

  if (clickedButton?.id === "open-options") {
    await chrome.runtime.openOptionsPage();
    return;
  }

  if (clickedButton?.id === "clear-search") {
    state.filter = "";
    nodes.searchInput.value = "";
    syncSearchQuery();
    render();
    return;
  }

  if (clickedButton?.id === "export-all") {
    exportGroups(state.groups, "all-saved-groups");
    return;
  }

  if (clickedButton?.id === "remove-duplicates") {
    openDuplicateSelection();
    return;
  }

  if (clickedButton?.id === "confirm-cancel") {
    closeConfirmation();
    return;
  }

  if (clickedButton?.id === "confirm-delete") {
    await confirmPendingAction();
    return;
  }

  if (clickedButton?.id === "confirm-select-all") {
    setAllDuplicateSelections(true);
    return;
  }

  if (clickedButton?.id === "confirm-clear-all") {
    setAllDuplicateSelections(false);
    return;
  }

  if (event.target === nodes.confirmOverlay) {
    closeConfirmation();
    return;
  }

  const actionElement = event.target.closest("[data-action]");
  const action = actionElement?.dataset.action;
  const groupElement = actionElement?.closest("[data-group-id]") || event.target.closest("[data-group-id]");
  const groupId = groupElement?.dataset.groupId;
  const tabId = event.target.closest("[data-tab-id]")?.dataset.tabId;
  const group = state.groups.find((item) => item.id === groupId);

  if (!action || !groupId) {
    return;
  }

  if (action === "restore-group" || action === "restore-tab") {
    event.preventDefault();
  }

  if (action === "restore-group") {
    const restoreBehavior = getRestoreBehavior(state.settings, event);
    await sendMessage({
      type: "restoreGroup",
      groupId,
      keepTabs: restoreBehavior.keepTabs,
      archive: restoreBehavior.archive,
      target: state.settings.restoreGroupDestination,
      active: false
    });
    setStatus("Restored group.");
    return;
  }

  if (action === "copy-group") {
    if (!group) {
      return;
    }

    await copyTabsToClipboard(group.tabs);
    setStatus("Copied group to the clipboard.");
    return;
  }

  if (action === "export-group") {
    if (!group) {
      return;
    }

    exportGroups([group], group.title || "saved-group");
    return;
  }

  if (action === "toggle-archive") {
    const response = await sendMessage({
      type: "toggleGroupFlag",
      groupId,
      flag: "archived"
    });
    updateLocalGroupFlag(groupId, "archived", response?.value);
    render();
    return;
  }

  if (action === "toggle-pin") {
    const response = await sendMessage({
      type: "toggleGroupFlag",
      groupId,
      flag: "pinned"
    });
    // Update the local flag immediately so the collector does not jump the
    // user back to the top of the page while storage change events settle.
    updateLocalGroupFlag(groupId, "pinned", response?.value);
    render();
    setStatus(response?.value ? "Pinned group tabs in the browser." : "Unpinned group tabs from the browser.");
    return;
  }

  if (action === "toggle-lock") {
    const response = await sendMessage({
      type: "toggleGroupFlag",
      groupId,
      flag: "locked"
    });
    updateLocalGroupFlag(groupId, "locked", response?.value);
    render();
    return;
  }

  if (action === "delete-group") {
    if (!canDeleteSavedGroup(group)) {
      setStatus("Unlock the group before deleting it.");
      return;
    }

    openConfirmation({
      title: "Delete this group?",
      body: `This will permanently remove "${group?.title || "Untitled group"}" and ${group?.tabs.length || 0} saved ${group?.tabs.length === 1 ? "tab" : "tabs"} from Tab Collector.`,
      confirmLabel: "Delete group",
      onConfirm: async () => {
        await sendMessage({
          type: "deleteGroup",
          groupId
        });
        setStatus("Deleted group.");
      }
    });
    return;
  }

  if (action === "restore-tab" && tabId) {
    const restoreBehavior = getRestoreBehavior(state.settings, event);
    await sendMessage({
      type: "restoreTab",
      groupId,
      tabId,
      keepTabs: restoreBehavior.keepTabs,
      archive: restoreBehavior.archive,
      active: restoreBehavior.active,
      newWindow: restoreBehavior.newWindow
    });
    setStatus("Restored tab.");
    return;
  }

  if (action === "delete-tab" && tabId) {
    if (!canDeleteSavedGroup(group)) {
      setStatus("Unlock the group before removing tabs.");
      return;
    }

    const tab = group?.tabs.find((item) => item.id === tabId);
    openConfirmation({
      title: "Remove this tab?",
      body: `This will remove "${tab?.title || formatUrlForDisplay(tab?.url || "", state.settings.urlDisplay) || "Saved tab"}" from "${group?.title || "Untitled group"}".`,
      confirmLabel: "Remove tab",
      onConfirm: async () => {
        await sendMessage({
          type: "deleteTab",
          groupId,
          tabId
        });
        setStatus("Removed tab from the group.");
      }
    });
  }
}

function handleChange(event) {
  if (event.target.matches(".collector-duplicate-checkbox")) {
    updateConfirmationSelectionState();
  }
}

async function handleThemeChange(event) {
  if (event.target !== nodes.themeSelect) {
    return;
  }

  state.settings.theme = normalizeTheme(event.target.value);
  syncThemeControls();
  applyTheme(state.settings);
  await chrome.storage.local.set({
    settings: state.settings
  });
  setStatus(`Theme set to ${getTheme(state.settings.theme).label}.`);
}

async function handleThemeModeChange(event) {
  if (event.target !== nodes.themeModeSelect) {
    return;
  }

  state.settings.themeMode = normalizeThemeMode(event.target.value);
  syncThemeControls();
  applyTheme(state.settings);
  await chrome.storage.local.set({
    settings: state.settings
  });
  setStatus(`Appearance set to ${state.settings.themeMode}.`);
}

function handleExportFormatChange(event) {
  if (event.target !== nodes.exportFormatSelect) {
    return;
  }

  state.exportFormat = normalizeExportFormat(event.target.value);
  setStatus(`Export format set to ${formatExportFormatLabel(state.exportFormat)}.`);
}

async function handleBlur(event) {
  if (event.target.matches("input[data-role='group-title']")) {
    const groupId = event.target.closest("[data-group-id]")?.dataset.groupId;

    if (!groupId) {
      return;
    }

    await sendMessage({
      type: "renameGroup",
      groupId,
      title: event.target.value
    });
    setStatus("Saved title.");
    return;
  }

  if (event.target.matches("textarea[data-role='group-notes']")) {
    await saveNotes(event.target);
  }
}

async function handleKeyDown(event) {
  if (isConfirmationOpen() && event.key === "Escape") {
    event.preventDefault();
    closeConfirmation();
    return;
  }

  if (event.key === "/" && !isTextInput(event.target)) {
    event.preventDefault();
    nodes.searchInput.focus();
    nodes.searchInput.select();
    return;
  }

  if (event.key === "Tab" && !isTextInput(event.target)) {
    const cards = [...document.querySelectorAll(".tabGroupBody[data-group-id]")];

    if (!cards.length) {
      return;
    }

    event.preventDefault();
    moveGroupFocus(cards, event.shiftKey ? -1 : 1);
    return;
  }

  if (event.key === "Enter" && event.target.matches(".tabGroupBody[data-group-id]")) {
    event.preventDefault();
    const restoreBehavior = getRestoreBehavior(state.settings, event);
    await sendMessage({
      type: "restoreGroup",
      groupId: event.target.dataset.groupId,
      keepTabs: restoreBehavior.keepTabs,
      archive: restoreBehavior.archive,
      target: state.settings.restoreGroupDestination,
      active: false
    });
    setStatus("Restored group.");
    return;
  }

  if (event.key === "Enter" && event.target.matches(".tab[data-tab-id]")) {
    event.preventDefault();
    const restoreBehavior = getRestoreBehavior(state.settings, event);
    await sendMessage({
      type: "restoreTab",
      groupId: event.target.dataset.groupId,
      tabId: event.target.dataset.tabId,
      keepTabs: restoreBehavior.keepTabs,
      archive: restoreBehavior.archive,
      active: restoreBehavior.active,
      newWindow: restoreBehavior.newWindow
    });
    setStatus("Restored tab.");
    return;
  }

  if (
    event.key === "Enter" &&
    event.target instanceof HTMLElement &&
    event.target.matches("input[data-role='group-title']")
  ) {
    event.preventDefault();
    event.target.blur();
    return;
  }

  if (
    event.key === "Enter" &&
    (event.ctrlKey || event.metaKey) &&
    event.target instanceof HTMLElement &&
    event.target.matches("textarea[data-role='group-notes']")
  ) {
    event.preventDefault();
    await saveNotes(event.target);
    return;
  }

  if (event.key === "Backspace" && event.target.matches(".tabGroupBody[data-group-id]")) {
    event.preventDefault();
    nodes.searchInput.focus();
  }
}

function handleDragStart(event) {
  const row = event.target.closest(".tab[data-tab-id]");

  if (!row) {
    return;
  }

  const group = state.groups.find((item) => item.id === row.dataset.groupId);
  const tab = group?.tabs.find((item) => item.id === row.dataset.tabId);

  if (!tab) {
    return;
  }

  event.dataTransfer.setData("text/plain", `${tab.title} | ${tab.url}`);
  event.dataTransfer.setData("text/uri-list", tab.url);
  event.dataTransfer.setData(
    "text/html",
    `<a href="${escapeAttribute(tab.url)}">${escapeHtml(tab.title)}</a>`
  );
}

function handleSearchInput() {
  state.filter = nodes.searchInput.value.trim();
  syncSearchQuery();
  render();
}

function formatSearchSummary(filter) {
  const normalizedFilter = String(filter || "").trim();
  return normalizedFilter || "All saved tabs";
}

function updateLocalGroupFlag(groupId, flag, value) {
  if (typeof value !== "boolean") {
    return;
  }

  const group = state.groups.find((item) => item.id === groupId);

  if (!group) {
    return;
  }

  group[flag] = value;
}

function buildGroupSearchContextMarkup(group, filter) {
  const normalizedFilter = String(filter || "").trim();

  if (!normalizedFilter) {
    return "";
  }

  const matches = [];

  if (containsSearchText(group.title, normalizedFilter)) {
    matches.push({
      label: "Title",
      snippet: group.title
    });
  }

  if (containsSearchText(group.notes, normalizedFilter)) {
    matches.push({
      label: "Notes",
      snippet: buildSearchSnippet(group.notes, normalizedFilter)
    });
  }

  if (!matches.length) {
    return "";
  }

  return `
    <div class="collector-search-context">
      <span class="tree-item-text">Search matches</span>
      <div class="collector-search-context-list">
        ${matches
          .map(
            (match) => `
              <div class="collector-search-context-item">
                <strong>${escapeHtml(match.label)}</strong>
                <span>${highlightSearchText(match.snippet, normalizedFilter)}</span>
              </div>
            `
          )
          .join("")}
      </div>
    </div>
  `;
}

function buildSearchSnippet(value, filter, contextRadius = 64) {
  const text = String(value || "");
  const lowerText = text.toLowerCase();
  const lowerFilter = String(filter || "").toLowerCase();
  const matchIndex = lowerText.indexOf(lowerFilter);

  if (matchIndex === -1) {
    return text;
  }

  const start = Math.max(0, matchIndex - contextRadius);
  const end = Math.min(text.length, matchIndex + lowerFilter.length + contextRadius);
  let snippet = text.slice(start, end).trim();

  if (start > 0) {
    snippet = `...${snippet}`;
  }

  if (end < text.length) {
    snippet = `${snippet}...`;
  }

  return snippet;
}

function highlightSearchText(value, filter) {
  const text = String(value || "");
  const normalizedFilter = String(filter || "").trim();

  if (!text) {
    return "";
  }

  if (!normalizedFilter) {
    return escapeHtml(text);
  }

  const pattern = new RegExp(`(${escapeRegExp(normalizedFilter)})`, "gi");
  const parts = text.split(pattern);

  return parts
    .map((part, index) =>
      index % 2 === 1
        ? `<mark class="collector-search-highlight">${escapeHtml(part)}</mark>`
        : escapeHtml(part)
    )
    .join("");
}

function containsSearchText(value, filter) {
  return String(value || "").toLowerCase().includes(String(filter || "").toLowerCase());
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function applyTheme(settings) {
  applyDocumentTheme(settings);
}

function syncThemeControls() {
  const theme = getTheme(state.settings?.theme);

  nodes.themeSelect.value = theme.id;
  nodes.themeModeSelect.value = normalizeThemeMode(state.settings?.themeMode);
  nodes.themeModeSelect.disabled = false;
  nodes.themeModeSelect.title = "";
}

function syncSearchQuery() {
  const url = new URL(window.location.href);

  if (state.filter) {
    url.searchParams.set("search", state.filter);
  } else {
    url.searchParams.delete("search");
  }

  history.replaceState(null, "", url);
}

function moveGroupFocus(cards, direction) {
  const activeIndex = cards.findIndex((card) => card === document.activeElement);
  const nextIndex = getNextFocusIndex(cards.length, activeIndex, direction);

  cards[nextIndex].focus();
}

async function saveNotes(textarea) {
  await sendMessage({
    type: "updateGroupNotes",
    groupId: textarea.dataset.groupId,
    notes: textarea.value
  });
  setStatus("Saved notes.");
}

async function copyTabsToClipboard(tabs) {
  const payload = buildClipboardPayload(tabs, state.settings.clipboardFormat);

  if (
    state.settings.clipboardFormat === "rich" &&
    navigator.clipboard?.write &&
    window.ClipboardItem
  ) {
    await navigator.clipboard.write([
      new ClipboardItem({
        "text/plain": new Blob([payload.text], { type: "text/plain" }),
        "text/html": new Blob([payload.html], { type: "text/html" })
      })
    ]);
    return;
  }

  await navigator.clipboard.writeText(payload.text);
}

function openDuplicateSelection() {
  const preview = getDuplicateTabPreview(state.groups);

  if (!preview.duplicateCount) {
    setStatus("No duplicate tabs were found.");
    return;
  }

  openConfirmation({
    kind: "duplicate-selection",
    title: "Review duplicate tabs",
    body: "Select the duplicate saved tabs you want to remove. The first saved copy in each set is kept for you.",
    confirmLabel: "Remove selected",
    extraMarkup: buildDuplicateSelectionMarkup(preview.clusters),
    onConfirm: async (selectedTabs) => {
      if (!selectedTabs.length) {
        setStatus("Select at least one duplicate tab to remove.");
        return;
      }

      const storedState = await loadState();
      const result = removeSelectedTabsFromGroups(sortGroups(storedState.groups), selectedTabs);

      if (!result.removedCount) {
        setStatus("No duplicate tabs were removed.");
        return;
      }

      await saveState({
        ...storedState,
        groups: result.groups
      });
      state.groups = sortGroups(result.groups);
      render();

      const emptiedSuffix = result.emptiedGroupCount
        ? ` ${result.emptiedGroupCount} group${result.emptiedGroupCount === 1 ? " is" : "s are"} now empty.`
        : "";
      setStatus(
        `Removed ${result.removedCount} duplicate tab${
          result.removedCount === 1 ? "" : "s"
        }.${emptiedSuffix}`
      );
    }
  });
}

function buildDuplicateSelectionMarkup(clusters) {
  const duplicateCount = clusters.reduce((total, cluster) => total + cluster.duplicates.length, 0);

  return `
    <div class="collector-duplicate-toolbar">
      <p class="collector-duplicate-summary">
        ${clusters.length} duplicate set${clusters.length === 1 ? "" : "s"} found.
      </p>
      <span id="duplicate-selection-count" class="collector-duplicate-pill">
        ${duplicateCount} selected
      </span>
      <div class="collector-duplicate-utility">
        <button id="confirm-select-all" class="controlButton" type="button">Select all</button>
        <button id="confirm-clear-all" class="controlButton" type="button">Clear all</button>
      </div>
    </div>
    <div class="collector-duplicate-clusters">
      ${clusters
        .map((cluster) => {
          const originalTitle = cluster.original.title || formatUrlForDisplay(cluster.original.url, state.settings.urlDisplay);
          const originalUrl = formatUrlForDisplay(cluster.original.url, state.settings.urlDisplay);

          return `
            <section class="collector-duplicate-cluster">
              <div class="collector-duplicate-keep-card">
                <span class="collector-duplicate-badge">Keep</span>
                <div class="collector-duplicate-copy">
                  <strong>${escapeHtml(originalTitle || "Saved tab")}</strong>
                  <span class="collector-duplicate-url">${escapeHtml(originalUrl)}</span>
                </div>
                <span class="collector-duplicate-group-badge">
                  ${escapeHtml(cluster.original.groupTitle)}
                </span>
              </div>
              <div class="collector-duplicate-options">
                ${cluster.duplicates
                  .map((tab) => {
                    const displayTitle = tab.title || formatUrlForDisplay(tab.url, state.settings.urlDisplay);
                    const displayUrl = formatUrlForDisplay(tab.url, state.settings.urlDisplay);

                    return `
                      <label class="collector-duplicate-option">
                        <input
                          class="collector-duplicate-checkbox"
                          type="checkbox"
                          data-group-id="${escapeAttribute(tab.groupId)}"
                          data-tab-id="${escapeAttribute(tab.tabId)}"
                          checked
                        />
                        <span class="collector-duplicate-copy">
                          <strong>${escapeHtml(displayTitle || "Saved tab")}</strong>
                          <span class="collector-duplicate-url">${escapeHtml(displayUrl)}</span>
                        </span>
                        <span class="collector-duplicate-group-badge">
                          ${escapeHtml(tab.groupTitle)}
                        </span>
                      </label>
                    `;
                  })
                  .join("")}
              </div>
            </section>
          `;
        })
        .join("")}
    </div>
  `;
}

function exportGroups(groups, scopeLabel) {
  const payload = buildExportPayload(groups, scopeLabel);
  triggerDownload(payload);
  setStatus(
    `Prepared ${groups.length} group${groups.length === 1 ? "" : "s"} for ${formatExportFormatLabel(
      state.exportFormat
    ).toLowerCase()} export.`
  );
}

function buildExportPayload(groups, scopeLabel) {
  const exportedAt = new Date().toISOString();
  const title = scopeLabel === "all-saved-groups" ? "Tab Collector export" : `Tab Collector export - ${scopeLabel}`;

  switch (state.exportFormat) {
    case COLLECTOR_EXPORT_FORMATS.JSON:
      return {
        content: serializeGroupsAsJson(groups, { exportedAt }),
        extension: "json",
        mimeType: "application/json;charset=utf-8",
        filename: buildExportFilename(scopeLabel, "json")
      };
    case COLLECTOR_EXPORT_FORMATS.CSV:
      return {
        content: `\uFEFF${serializeGroupsAsCsv(groups)}`,
        extension: "csv",
        mimeType: "text/csv;charset=utf-8",
        filename: buildExportFilename(scopeLabel, "csv")
      };
    case COLLECTOR_EXPORT_FORMATS.HTML:
    default:
      return {
        content: serializeGroupsAsHtml(groups, {
          exportedAt,
          title,
          themeLabel: getCurrentThemeLabel(),
          themeTokens: getExportThemeTokens()
        }),
        extension: "html",
        mimeType: "text/html;charset=utf-8",
        filename: buildExportFilename(scopeLabel, "html")
      };
  }
}

function triggerDownload({ content, filename, mimeType }) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.append(anchor);
  anchor.click();
  anchor.remove();
  setTimeout(() => URL.revokeObjectURL(url), 0);
}

function buildExportFilename(scopeLabel, extension) {
  const scope = sanitizeFileSegment(scopeLabel || "tab-collector-export");
  const stamp = new Date()
    .toISOString()
    .replaceAll(":", "-")
    .replace(/\.\d{3}Z$/, "Z");

  return `${scope}-${stamp}.${extension}`;
}

function sanitizeFileSegment(value) {
  const sanitized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return sanitized || "tab-collector-export";
}

function normalizeExportFormat(value) {
  return Object.values(COLLECTOR_EXPORT_FORMATS).includes(value)
    ? value
    : COLLECTOR_EXPORT_FORMATS.HTML;
}

function formatExportFormatLabel(format) {
  switch (format) {
    case COLLECTOR_EXPORT_FORMATS.JSON:
      return "JSON";
    case COLLECTOR_EXPORT_FORMATS.CSV:
      return "Comma-delimited";
    case COLLECTOR_EXPORT_FORMATS.HTML:
    default:
      return "HTML";
  }
}

function getCurrentThemeLabel() {
  return formatThemeLabel(state.settings);
}

function getExportThemeTokens() {
  const styles = getComputedStyle(document.documentElement);

  return {
    bgColor: readThemeToken(styles, "--bg-color", "#101723"),
    textColor: readThemeToken(styles, "--text-color", "#ecf2fb"),
    weakTextColor: readThemeToken(styles, "--text-color-weak", "#9daec5"),
    emphasisTextColor: readThemeToken(styles, "--text-color-em", "#ffffff"),
    surfaceStart: readThemeToken(styles, "--surface-gradient-start", "rgba(20, 29, 45, 0.96)"),
    surfaceEnd: readThemeToken(styles, "--surface-gradient-end", "rgba(12, 18, 28, 0.98)"),
    heroBorder: readThemeToken(styles, "--hero-border", "rgba(255, 255, 255, 0.08)"),
    brandStart: readThemeToken(styles, "--gs-menu-gradient-start", "#479bcc"),
    brandAccent: readThemeToken(styles, "--gs-accent", "#ff8c42"),
    brandMuted: readThemeToken(styles, "--gs-muted-strong", "#bccddd"),
    highlightBg: readThemeToken(styles, "--text-highlight-bg-color", "rgba(255, 140, 66, 0.24)")
  };
}

function readThemeToken(styles, name, fallback) {
  const value = styles.getPropertyValue(name).trim();
  return value || fallback;
}

function formatDate(value) {
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}

function isTextInput(target) {
  return target instanceof HTMLElement && ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName);
}

function showLoading(isLoading) {
  loadingSpinner.hidden = !isLoading;
  contentArea.hidden = isLoading;
}

function captureViewState() {
  return {
    scrollX: window.scrollX,
    scrollY: window.scrollY,
    focusTarget: describeFocusTarget(document.activeElement)
  };
}

async function restoreViewState(viewState) {
  await new Promise((resolve) => {
    requestAnimationFrame(() => resolve());
  });

  window.scrollTo(viewState.scrollX, viewState.scrollY);

  const focusTarget = findFocusTarget(viewState.focusTarget);

  if (focusTarget) {
    focusTarget.focus({
      preventScroll: true
    });
  }
}

function describeFocusTarget(node) {
  if (!(node instanceof HTMLElement)) {
    return null;
  }

  if (node.id && contentArea.contains(node)) {
    return {
      kind: "id",
      id: node.id
    };
  }

  const groupElement = node.closest("[data-group-id]");
  const tabElement = node.closest("[data-tab-id]");
  const actionElement = node.closest("[data-action]");

  if (actionElement instanceof HTMLElement) {
    return {
      kind: "action",
      action: actionElement.dataset.action || "",
      groupId: groupElement?.dataset.groupId || "",
      tabId: tabElement?.dataset.tabId || ""
    };
  }

  if (node.matches("input[data-role='group-title'], textarea[data-role='group-notes']")) {
    return {
      kind: "editor",
      role: node.dataset.role || "",
      groupId: groupElement?.dataset.groupId || ""
    };
  }

  if (node.matches(".tabGroupBody[data-group-id]")) {
    return {
      kind: "group",
      groupId: node.dataset.groupId || ""
    };
  }

  return null;
}

function findFocusTarget(target) {
  if (!target) {
    return null;
  }

  if (target.kind === "id" && target.id) {
    return document.getElementById(target.id);
  }

  if (target.kind === "action" && target.action && target.groupId) {
    const tabScope = target.tabId
      ? ` [data-tab-id="${escapeSelector(target.tabId)}"]`
      : "";
    const selector = `[data-group-id="${escapeSelector(target.groupId)}"]${tabScope} [data-action="${escapeSelector(target.action)}"]`;
    return document.querySelector(selector);
  }

  if (target.kind === "editor" && target.role && target.groupId) {
    const selector = `[data-group-id="${escapeSelector(target.groupId)}"] [data-role="${escapeSelector(target.role)}"]`;
    return document.querySelector(selector);
  }

  if (target.kind === "group" && target.groupId) {
    const selector = `.tabGroupBody[data-group-id="${escapeSelector(target.groupId)}"]`;
    return document.querySelector(selector);
  }

  return null;
}

function escapeSelector(value) {
  if (typeof CSS !== "undefined" && typeof CSS.escape === "function") {
    return CSS.escape(String(value));
  }

  return String(value).replaceAll("\\", "\\\\").replaceAll("\"", "\\\"");
}

function setStatus(message) {
  nodes.statusNode.textContent = String(message || "").trim();
}

function openConfirmation({ kind = "confirm", title, body, confirmLabel, onConfirm, extraMarkup = "" }) {
  pendingConfirmation = {
    kind,
    baseConfirmLabel: confirmLabel,
    onConfirm,
    restoreFocusNode: document.activeElement instanceof HTMLElement ? document.activeElement : null
  };
  nodes.confirmTitleNode.textContent = title;
  nodes.confirmBodyNode.textContent = body;
  nodes.confirmExtraNode.innerHTML = extraMarkup;
  nodes.confirmExtraNode.hidden = !extraMarkup;
  nodes.confirmActionButton.textContent = confirmLabel;
  nodes.confirmActionButton.disabled = false;
  nodes.confirmOverlay.hidden = false;
  document.body.classList.add("collector-confirm-open");
  updateConfirmationSelectionState();
  nodes.confirmCancelButton.focus();
}

function closeConfirmation({ restoreFocus = true } = {}) {
  const restoreFocusNode = pendingConfirmation?.restoreFocusNode;
  pendingConfirmation = null;
  nodes.confirmOverlay.hidden = true;
  document.body.classList.remove("collector-confirm-open");
  nodes.confirmTitleNode.textContent = "Delete this item?";
  nodes.confirmBodyNode.textContent = "This action removes the saved item from Tab Collector.";
  nodes.confirmExtraNode.innerHTML = "";
  nodes.confirmExtraNode.hidden = true;
  nodes.confirmActionButton.textContent = "Delete";
  nodes.confirmActionButton.disabled = false;

  if (restoreFocus && restoreFocusNode?.isConnected) {
    restoreFocusNode.focus();
  }
}

async function confirmPendingAction() {
  const action = pendingConfirmation?.onConfirm;
  const selectedTabs = getSelectedDuplicateTabs();

  if (!action) {
    closeConfirmation();
    return;
  }

  closeConfirmation({ restoreFocus: false });
  await action(selectedTabs);
}

function isConfirmationOpen() {
  return Boolean(nodes.confirmOverlay && !nodes.confirmOverlay.hidden);
}

function getSelectedDuplicateTabs() {
  return [...document.querySelectorAll(".collector-duplicate-checkbox:checked")].map((input) => ({
    groupId: input.dataset.groupId || "",
    tabId: input.dataset.tabId || ""
  }));
}

function setAllDuplicateSelections(isSelected) {
  for (const input of document.querySelectorAll(".collector-duplicate-checkbox")) {
    input.checked = isSelected;
  }

  updateConfirmationSelectionState();
}

function updateConfirmationSelectionState() {
  if (pendingConfirmation?.kind !== "duplicate-selection") {
    return;
  }

  const selectedCount = getSelectedDuplicateTabs().length;
  const selectionCountNode = document.querySelector("#duplicate-selection-count");

  if (selectionCountNode) {
    selectionCountNode.textContent = `${selectedCount} selected`;
  }

  nodes.confirmActionButton.textContent = `${pendingConfirmation.baseConfirmLabel} (${selectedCount})`;
  nodes.confirmActionButton.disabled = selectedCount === 0;
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
