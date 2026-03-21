import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

import { setChromeMock } from "./test-helpers.js";

setChromeMock();

const shared = await import("../shared.js");

test("registry values are unique within each public contract", () => {
  const registries = [
    shared.TOOLBAR_ACTIONS,
    shared.MESSAGE_TYPES,
    shared.POPUP_ACTIONS,
    shared.CONTEXT_MENU_IDS,
    shared.COMMAND_IDS
  ];

  for (const registry of registries) {
    const values = Object.values(registry);
    assert.equal(values.length, new Set(values).size);
  }
});

test("toolbar action settings are backed by the shared registry", () => {
  const toolbarSection = shared.SETTINGS_SECTIONS.find((section) => section.key === "toolbarAction");

  assert.ok(toolbarSection);
  assert.deepEqual(
    toolbarSection.options.map((option) => option.value),
    [
      shared.TOOLBAR_ACTIONS.SAVE_WINDOW,
      shared.TOOLBAR_ACTIONS.SAVE_CURRENT,
      shared.TOOLBAR_ACTIONS.POPUP
    ]
  );
});

test("theme settings expose Griffin plus imported palette choices", () => {
  const themeSection = shared.SETTINGS_SECTIONS.find((section) => section.key === "theme");
  const themeModeSection = shared.SETTINGS_SECTIONS.find((section) => section.key === "themeMode");

  assert.ok(themeSection);
  assert.ok(themeModeSection);
  assert.deepEqual(
    themeSection.options.map((option) => option.value),
    ["griffin", "cobalt", "ember", "forest"]
  );
  assert.deepEqual(
    themeModeSection.options.map((option) => option.value),
    ["system", "light", "dark"]
  );
});

test("manifest command IDs stay aligned with the shared command registry", async () => {
  const manifest = JSON.parse(await readFile(new URL("../manifest.json", import.meta.url), "utf8"));

  assert.ok(manifest.commands[shared.COMMAND_IDS.SAVE_CURRENT_TAB]);
  assert.ok(manifest.commands[shared.COMMAND_IDS.OPEN_COLLECTOR]);
});

test("manifest and main UI entry points are wired to the brand asset set", async () => {
  const [manifest, popupHtml, optionsHtml, collectorHtml, collectorJs, packagePs1] =
    await Promise.all([
      readFile(new URL("../manifest.json", import.meta.url), "utf8").then((value) =>
        JSON.parse(value)
      ),
      readFile(new URL("../popup.html", import.meta.url), "utf8"),
      readFile(new URL("../options.html", import.meta.url), "utf8"),
      readFile(new URL("../collector.html", import.meta.url), "utf8"),
      readFile(new URL("../collector.js", import.meta.url), "utf8"),
      readFile(new URL("../package.ps1", import.meta.url), "utf8")
    ]);

  assert.equal(manifest.icons["16"], "assets/brand/tab-collector-64.png");
  assert.equal(manifest.icons["128"], "assets/brand/tab-collector-128.png");
  assert.equal(manifest.action.default_icon["32"], "assets/brand/tab-collector-64.png");
  assert.equal(manifest.action.default_icon["128"], "assets/brand/tab-collector-128.png");

  for (const html of [popupHtml, optionsHtml, collectorHtml]) {
    assert.match(html, /assets\/brand\/tab-collector-64\.png/);
    assert.match(html, /rel="icon"/);
  }

  assert.match(popupHtml, /assets\/brand\/tab-collector-128\.png/);
  assert.match(optionsHtml, /assets\/brand\/tab-collector-128\.png/);
  assert.match(collectorJs, /assets\/brand\/tab-collector-128\.png/);
  assert.match(packagePs1, /tab_collector_exact_match_bundle\.zip/);
});

test("popup surfaces expose the expected action IDs", async () => {
  const [popupHtml, popupJs, popupCss] = await Promise.all([
    readFile(new URL("../popup.html", import.meta.url), "utf8"),
    readFile(new URL("../popup.js", import.meta.url), "utf8"),
    readFile(new URL("../popup.css", import.meta.url), "utf8")
  ]);

  for (const action of [
    shared.POPUP_ACTIONS.OPEN_COLLECTOR,
    shared.POPUP_ACTIONS.SAVE_WINDOW,
    shared.POPUP_ACTIONS.SAVE_TAB,
    shared.POPUP_ACTIONS.SAVE_GROUP,
    shared.POPUP_ACTIONS.EXCLUDE_SITE,
    shared.POPUP_ACTIONS.OPEN_OPTIONS
  ]) {
    assert.match(popupHtml, new RegExp(`data-action="${action}"`));
  }

  assert.match(popupJs, /POPUP_ACTIONS\.OPEN_SAVED_GROUP/);
  assert.match(popupJs, /MESSAGE_TYPES\.SAVE_SELECTED_TABS/);
  assert.match(popupJs, /MESSAGE_TYPES\.SAVE_CURRENT_GROUP/);
  assert.match(popupCss, /--button-ambient-shadow/);
  assert.match(popupCss, /\.menu-button/);
});

test("options surface exposes the import workflow for saved-tab exports", async () => {
  const [optionsHtml, optionsJs, optionsCss] = await Promise.all([
    readFile(new URL("../options.html", import.meta.url), "utf8"),
    readFile(new URL("../options.js", import.meta.url), "utf8"),
    readFile(new URL("../options.css", import.meta.url), "utf8")
  ]);

  assert.match(optionsHtml, /id="import-form"/);
  assert.match(optionsHtml, /id="import-file"/);
  assert.match(optionsHtml, /id="remove-duplicates"/);
  assert.match(optionsHtml, /class="hero-controls"/);
  assert.match(optionsHtml, /id="status" class="status hero-status"/);
  assert.match(optionsJs, /parseImportedState/);
  assert.match(optionsJs, /mergeImportedState/);
  assert.match(optionsJs, /removeDuplicateTabsFromGroups/);
  assert.match(optionsJs, /saveState/);
  assert.match(optionsCss, /--button-ambient-shadow/);
  assert.match(optionsCss, /\.hero-controls/);
  assert.match(optionsCss, /\.hero-status/);
});

test("collector surface shows the active search summary and highlight treatment", async () => {
  const [collectorJs, tabsCss] = await Promise.all([
    readFile(new URL("../collector.js", import.meta.url), "utf8"),
    readFile(new URL("../tabs.css", import.meta.url), "utf8")
  ]);

  assert.match(collectorJs, /Current search/);
  assert.doesNotMatch(collectorJs, /Search keyword/);
  assert.match(collectorJs, /id="export-format"/);
  assert.match(collectorJs, /id="export-all"/);
  assert.match(collectorJs, /id="remove-duplicates"/);
  assert.match(collectorJs, /collector-header-status/);
  assert.match(collectorJs, /collector-success-action/);
  assert.match(collectorJs, /data-action="export-group"/);
  assert.match(collectorJs, /collector-search-highlight/);
  assert.match(collectorJs, /role="alertdialog"/);
  assert.match(collectorJs, /Confirm delete/);
  assert.match(collectorJs, /refreshState\(\{\s*preserveViewport:\s*true\s*\}\)/);
  assert.match(collectorJs, /refreshState\(\{\s*showLoadingState:\s*true\s*\}\)/);
  assert.match(collectorJs, /window\.scrollTo\(/);
  assert.match(collectorJs, /Pinned group tabs in the browser\./);
  assert.match(collectorJs, /Unpinned group tabs from the browser\./);
  assert.doesNotMatch(collectorJs, /Unlock this group to delete it/);
  assert.doesNotMatch(collectorJs, /Unlock this group to remove tabs/);
  assert.match(tabsCss, /\.controlButton:hover,\s*\.controlButton:focus-visible/);
  assert.match(tabsCss, /\.collector-export-field/);
  assert.match(tabsCss, /grid-template-columns:\s*minmax\(0,\s*1\.45fr\)\s*minmax\(0,\s*360px\)/);
  assert.match(tabsCss, /\.collector-search-field\s*\{[\s\S]*grid-column:\s*1\s*\/\s*-1;/);
  assert.match(
    tabsCss,
    /grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(min\(100%,\s*220px\),\s*1fr\)\)/
  );
  assert.match(tabsCss, /--collector-button-ambient-shadow/);
  assert.match(tabsCss, /--collector-danger-hover-shadow/);
  assert.match(tabsCss, /--collector-primary-hover-shadow/);
  assert.match(tabsCss, /\.collector-success-action/);
  assert.match(tabsCss, /\.collector-search-highlight/);
  assert.match(tabsCss, /\.collector-confirm-overlay/);
  assert.match(tabsCss, /\.collector-confirm-overlay\[hidden\]/);
  assert.match(tabsCss, /\.collector-confirm-card/);
  assert.match(tabsCss, /\.collector-header-status/);
  assert.match(tabsCss, /@media \(max-width: 1180px\)/);
  assert.match(
    tabsCss,
    /@media \(max-width: 1024px\)[\s\S]*?\.collector-group-actions\s*\{[\s\S]*?display:\s*grid;[\s\S]*?grid-template-columns:\s*repeat\(auto-fit,\s*minmax\(min\(100%,\s*132px\),\s*1fr\)\);[\s\S]*?width:\s*100%;[\s\S]*?\}/
  );
  assert.match(
    tabsCss,
    /@media \(max-width: 860px\)[\s\S]*?\.collector-group-header\s*\{[\s\S]*?justify-content:\s*flex-start;[\s\S]*?gap:\s*12px;[\s\S]*?\}/
  );
  assert.match(
    tabsCss,
    /@media \(max-width: 860px\)[\s\S]*?\.collector-group-actions\s*\{[\s\S]*?grid-template-columns:\s*repeat\(2,\s*minmax\(0,\s*1fr\)\);[\s\S]*?width:\s*100%;[\s\S]*?\}/
  );
  assert.match(
    tabsCss,
    /@media \(max-width: 860px\)[\s\S]*?\.collector-input-grid\s*\{[\s\S]*?grid-template-columns:\s*1fr;[\s\S]*?\}/
  );
  assert.match(
    tabsCss,
    /@media \(max-width: 720px\)[\s\S]*?\.collector-header-buttons\s*\{[\s\S]*?grid-template-columns:\s*1fr;[\s\S]*?\}/
  );
  assert.match(
    tabsCss,
    /@media \(max-width: 720px\)[\s\S]*?\.collector-group-actions\s*\{[\s\S]*?grid-template-columns:\s*1fr;[\s\S]*?\}/
  );
  assert.match(tabsCss, /\.collector-tabs \.tabLinkText\s*\{[\s\S]*?overflow-wrap:\s*anywhere;/);
  assert.match(
    tabsCss,
    /\.collector-tabs \.tabUrl\s*\{[\s\S]*?min-width:\s*0;[\s\S]*?overflow-wrap:\s*anywhere;/
  );
  assert.match(tabsCss, /\.collector-tabs \.oneLineWithEllipsis/);
  assert.match(tabsCss, /\.collector-tabs \.tabUrlText/);
});

test("background wiring routes save actions through registries", async () => {
  const backgroundJs = await readFile(new URL("../background.js", import.meta.url), "utf8");

  for (const token of [
    "TOOLBAR_ACTIONS.SAVE_WINDOW",
    "TOOLBAR_ACTIONS.SAVE_CURRENT",
    "MESSAGE_TYPES.SAVE_CURRENT_WINDOW",
    "MESSAGE_TYPES.SAVE_CURRENT_TAB",
    "MESSAGE_TYPES.SAVE_CURRENT_GROUP",
    "MESSAGE_TYPES.SAVE_SELECTED_TABS",
    "CONTEXT_MENU_IDS.SAVE_CURRENT_WINDOW",
    "CONTEXT_MENU_IDS.SAVE_CURRENT_TAB",
    "CONTEXT_MENU_IDS.SAVE_CURRENT_GROUP",
    "COMMAND_IDS.SAVE_CURRENT_TAB"
  ]) {
    assert.match(backgroundJs, new RegExp(token.replaceAll(".", "\\.")));
  }

  for (const functionName of [
    "saveCurrentWindow",
    "saveCurrentTab",
    "saveCurrentGroup",
    "saveSelectedTabs",
    "saveTabsToCollector",
    "excludeDomainFromUrl"
  ]) {
    assert.match(backgroundJs, new RegExp(`\\b${functionName}\\b`));
  }
});

test("repo surfaces do not retain OneTab naming and the omnibox suggestion uses Tab Collector", async () => {
  const files = await Promise.all([
    readFile(new URL("../background.js", import.meta.url), "utf8"),
    readFile(new URL("../collector.js", import.meta.url), "utf8"),
    readFile(new URL("../popup.js", import.meta.url), "utf8"),
    readFile(new URL("../options.js", import.meta.url), "utf8"),
    readFile(new URL("../shared.js", import.meta.url), "utf8"),
    readFile(new URL("../manifest.json", import.meta.url), "utf8")
  ]);
  const combined = files.join("\n");

  assert.doesNotMatch(combined, /OneTab/i);
  assert.match(combined, /Search Tab Collector/);
  assert.match(combined, /canDeleteSavedGroup/);
});

test("theme setting is applied through the shared theme contract across UI surfaces", async () => {
  const files = await Promise.all([
    readFile(new URL("../theme.js", import.meta.url), "utf8"),
    readFile(new URL("../shared.js", import.meta.url), "utf8"),
    readFile(new URL("../collector.js", import.meta.url), "utf8"),
    readFile(new URL("../options.js", import.meta.url), "utf8"),
    readFile(new URL("../popup.js", import.meta.url), "utf8"),
    readFile(new URL("../tabs.css", import.meta.url), "utf8"),
    readFile(new URL("../options.css", import.meta.url), "utf8"),
    readFile(new URL("../popup.css", import.meta.url), "utf8")
  ]);
  const [themeJs, sharedJs, collectorJs, optionsJs, popupJs, tabsCss, optionsCss, popupCss] = files;

  assert.match(themeJs, /applyDocumentTheme/);
  assert.match(themeJs, /THEME_IDS/);
  assert.match(themeJs, /cobalt/);
  assert.match(themeJs, /ember/);
  assert.match(themeJs, /forest/);
  assert.match(sharedJs, /key:\s*"theme"/);
  assert.match(collectorJs, /applyDocumentTheme/);
  assert.match(collectorJs, /theme-mode-select/);
  assert.match(optionsJs, /applyDocumentTheme/);
  assert.match(popupJs, /applyDocumentTheme/);
  assert.match(tabsCss, /data-theme-mode/);
  assert.match(optionsCss, /data-theme-mode/);
  assert.match(popupCss, /data-theme-mode/);
});

test("full-page surfaces keep their background layers fixed for scroll depth", async () => {
  const [tabsCss, optionsCss, popupCss] = await Promise.all([
    readFile(new URL("../tabs.css", import.meta.url), "utf8"),
    readFile(new URL("../options.css", import.meta.url), "utf8"),
    readFile(new URL("../popup.css", import.meta.url), "utf8")
  ]);

  assert.match(tabsCss, /background-attachment:\s*fixed,\s*fixed,\s*fixed/);
  assert.match(optionsCss, /background-attachment:\s*fixed,\s*fixed,\s*fixed/);
  assert.match(popupCss, /background-attachment:\s*fixed,\s*fixed/);
});

test("collector and popup dropdown controls use the themed custom select treatment", async () => {
  const [tabsCss, popupCss] = await Promise.all([
    readFile(new URL("../tabs.css", import.meta.url), "utf8"),
    readFile(new URL("../popup.css", import.meta.url), "utf8")
  ]);

  assert.match(tabsCss, /\.collector-theme-field select[\s\S]*appearance:\s*none/);
  assert.match(tabsCss, /\.collector-theme-field select[\s\S]*background-image:/);
  assert.match(tabsCss, /option,\s*optgroup\s*\{[\s\S]*background-color:\s*var\(--bg-color\)/);
  assert.match(popupCss, /\.field select[\s\S]*appearance:\s*none/);
  assert.match(popupCss, /\.field select[\s\S]*background-image:/);
  assert.match(
    popupCss,
    /option,\s*optgroup\s*\{[\s\S]*background-color:\s*var\(--dropdown-surface\)/
  );
});
