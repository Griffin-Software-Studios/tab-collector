import {
  SETTINGS_SECTIONS,
  getCollectorUrl,
  getTabCount,
  loadState,
  mergeImportedState,
  parseImportedState,
  saveState
} from "./shared.js";
import { applyDocumentTheme, normalizeTheme, normalizeThemeMode } from "./theme.js";
import { removeDuplicateTabsFromGroups } from "./collector-logic.js";

const state = {
  settings: null,
  groups: [],
  excludedDomains: [],
  commands: []
};

const settingsRoot = document.querySelector("#settings-root");
const excludedList = document.querySelector("#excluded-list");
const excludedForm = document.querySelector("#excluded-form");
const excludedInput = document.querySelector("#excluded-input");
const importForm = document.querySelector("#import-form");
const importFileInput = document.querySelector("#import-file");
const commandsList = document.querySelector("#commands-list");
const statusNode = document.querySelector("#status");
const groupCountNode = document.querySelector("#group-count");
const tabCountNode = document.querySelector("#tab-count");
const excludedCountNode = document.querySelector("#excluded-count");

await initialize();

document.addEventListener("change", handleSettingChange);
document.addEventListener("click", handleClick);
excludedForm.addEventListener("submit", handleExcludedSubmit);
importForm.addEventListener("submit", handleImportSubmit);
chrome.storage.onChanged.addListener(handleStorageChange);

async function initialize() {
  const storedState = await loadState();
  state.settings = storedState.settings;
  state.groups = storedState.groups;
  state.excludedDomains = storedState.excludedDomains;
  state.commands = await chrome.commands.getAll();
  applyCurrentTheme();

  render();
}

async function handleStorageChange(changes, areaName) {
  if (areaName !== "local") {
    return;
  }

  if (!changes.settings && !changes.groups && !changes.excludedDomains) {
    return;
  }

  const storedState = await loadState();
  state.settings = storedState.settings;
  state.groups = storedState.groups;
  state.excludedDomains = storedState.excludedDomains;
  applyCurrentTheme();
  render();
}

function render() {
  renderSummary();
  renderSettings();
  renderExcludedDomains();
  renderCommands();
}

function renderSummary() {
  groupCountNode.textContent = String(state.groups.length);
  tabCountNode.textContent = String(getTabCount(state.groups));
  excludedCountNode.textContent = String(state.excludedDomains.length);
}

function renderSettings() {
  settingsRoot.textContent = "";

  for (const section of SETTINGS_SECTIONS) {
    const card = document.createElement("section");
    card.className = "setting-card";
    card.dataset.settingKey = section.key;
    const headingId = `${section.key}-heading`;
    const choiceCountLabel = `${section.options.length} ${section.options.length === 1 ? "choice" : "choices"}`;

    const optionsMarkup = section.options
      .map((option) => {
        const checked = isOptionSelected(section.key, option.value);

        return `
          <label class="option-card">
            <span class="option-top">
              <input
                type="radio"
                name="${section.key}"
                value="${escapeAttribute(JSON.stringify(option.value))}"
                ${checked ? "checked" : ""}
              />
              <span>
                <strong>${escapeHtml(option.label)}</strong>
                ${option.description ? `<small>${escapeHtml(option.description)}</small>` : ""}
              </span>
            </span>
          </label>
        `;
      })
      .join("");

    card.innerHTML = `
      <div class="card-heading">
        <p class="section-kicker">Preference</p>
        <div class="card-heading-row">
          <h2 id="${escapeAttribute(headingId)}">${escapeHtml(section.title)}</h2>
          <span class="choice-count">${escapeHtml(choiceCountLabel)}</span>
        </div>
        ${section.note ? `<p>${escapeHtml(section.note)}</p>` : ""}
      </div>
      <fieldset class="option-list" aria-labelledby="${escapeAttribute(headingId)}">
        <legend class="visually-hidden">${escapeHtml(section.title)}</legend>
        ${optionsMarkup}
      </fieldset>
    `;

    settingsRoot.append(card);
  }
}

function renderExcludedDomains() {
  excludedList.textContent = "";

  if (!state.excludedDomains.length) {
    const empty = document.createElement("p");
    empty.className = "status";
    empty.textContent = "No excluded domains.";
    excludedList.append(empty);
    return;
  }

  for (const domain of state.excludedDomains) {
    const tag = document.createElement("div");
    tag.className = "tag";
    tag.innerHTML = `
      <span>${escapeHtml(domain)}</span>
      <button data-remove-domain="${escapeAttribute(domain)}" type="button">Remove</button>
    `;
    excludedList.append(tag);
  }
}

function renderCommands() {
  commandsList.textContent = "";

  for (const command of state.commands) {
    const row = document.createElement("div");
    row.className = "command-row";
    row.innerHTML = `
      <div>
        <strong>${escapeHtml(normalizeCommandName(command.name, command.description))}</strong>
        <span>${escapeHtml(command.description || "No description available")}</span>
      </div>
      <span class="shortcut">${escapeHtml(command.shortcut || "Not assigned")}</span>
    `;
    commandsList.append(row);
  }
}

function isOptionSelected(key, value) {
  return JSON.stringify(state.settings?.[key]) === JSON.stringify(value);
}

async function handleSettingChange(event) {
  if (!event.target.matches("input[type='radio'][name]")) {
    return;
  }

  const key = event.target.name;
  state.settings[key] = JSON.parse(event.target.value);

  if (key === "theme") {
    state.settings[key] = normalizeTheme(state.settings[key]);
    applyCurrentTheme();
  }

  if (key === "themeMode") {
    state.settings[key] = normalizeThemeMode(state.settings[key]);
    applyCurrentTheme();
  }

  await chrome.storage.local.set({
    settings: state.settings
  });
  setStatus("Settings saved.");
}

async function handleClick(event) {
  const domainToRemove = event.target.dataset.removeDomain;

  if (domainToRemove) {
    state.excludedDomains = state.excludedDomains.filter((domain) => domain !== domainToRemove);
    await chrome.storage.local.set({
      excludedDomains: state.excludedDomains
    });
    render();
    setStatus(`Removed ${domainToRemove} from the excluded list.`);
    return;
  }

  if (event.target.id === "open-collector") {
    await chrome.tabs.create({
      url: getCollectorUrl()
    });
    return;
  }

  if (event.target.id === "open-shortcuts") {
    try {
      await chrome.tabs.create({
        url: "edge://extensions/shortcuts"
      });
    } catch {
      setStatus("Open edge://extensions/shortcuts manually in Edge.");
      return;
    }

    setStatus("Opened Edge shortcut settings.");
    return;
  }

  if (event.target.id === "remove-duplicates") {
    const storedState = await loadState();
    const result = removeDuplicateTabsFromGroups(storedState.groups);

    if (!result.removedCount) {
      setStatus("No duplicate tabs were found.");
      return;
    }

    const nextState = {
      ...storedState,
      groups: result.groups
    };

    await saveState(nextState);
    state.settings = nextState.settings;
    state.groups = nextState.groups;
    state.excludedDomains = nextState.excludedDomains;
    render();

    const emptiedSuffix = result.emptiedGroupCount
      ? ` ${formatCount(result.emptiedGroupCount, "group")} ${result.emptiedGroupCount === 1 ? "is" : "are"} now empty.`
      : "";
    setStatus(
      `Removed ${formatCount(result.removedCount, "duplicate tab")}.${emptiedSuffix}`
    );
  }
}

async function handleExcludedSubmit(event) {
  event.preventDefault();

  const domain = normalizeDomain(excludedInput.value);

  if (!domain) {
    setStatus("Enter a valid domain.");
    return;
  }

  if (state.excludedDomains.includes(domain)) {
    setStatus("That domain is already excluded.");
    return;
  }

  state.excludedDomains.push(domain);
  state.excludedDomains.sort();
  await chrome.storage.local.set({
    excludedDomains: state.excludedDomains
  });
  excludedInput.value = "";
  render();
  setStatus(`Added ${domain} to the excluded list.`);
}

async function handleImportSubmit(event) {
  event.preventDefault();

  const file = importFileInput.files?.[0];

  if (!file) {
    setStatus("Choose an export file to import.");
    return;
  }

  try {
    const importedState = parseImportedState(await file.text());

    if (!importedState.groups.length && !importedState.excludedDomains.length) {
      setStatus("The selected export did not contain anything to import.");
      return;
    }

    const currentState = await loadState();
    const nextState = mergeImportedState(currentState, importedState);
    const importedGroupCount = importedState.groups.length;
    const importedTabCount = getTabCount(importedState.groups);

    await saveState(nextState);

    state.settings = nextState.settings;
    state.groups = nextState.groups;
    state.excludedDomains = nextState.excludedDomains;
    importForm.reset();
    render();
    setStatus(
      `Imported ${formatCount(importedGroupCount, "group")} and ${formatCount(importedTabCount, "tab")} from ${file.name}.`
    );
  } catch (error) {
    setStatus(error instanceof Error ? error.message : "Import failed.");
  }
}

function normalizeDomain(value) {
  const trimmed = value.trim().toLowerCase();

  if (!trimmed) {
    return "";
  }

  try {
    const parsed = new URL(trimmed.includes("://") ? trimmed : `https://${trimmed}`);
    return parsed.hostname.replace(/^www\./i, "");
  } catch {
    return "";
  }
}

function normalizeCommandName(name, description) {
  if (name === "_execute_action") {
    return "Toolbar icon action";
  }

  return description || name;
}

function formatCount(value, singular) {
  return `${value} ${singular}${value === 1 ? "" : "s"}`;
}

function applyCurrentTheme() {
  applyDocumentTheme(state.settings);
}

function setStatus(message) {
  statusNode.textContent = String(message || "").trim();
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
