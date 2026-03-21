<!--
File: MENU_OPTIONS_REFERENCE.md
Created: 2026/03/14 15:36:43
Modified: 2026/03/14 15:36:43
Project: Tab Collector
Repo: Tabs
Purpose: Explain the extension's menus, actions, and option surfaces.
Description: Documents the popup actions, page context-menu actions, options
settings, keyboard command, and current browser-platform limitations.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials. Redact sensitive values in logs and examples.
Notes: User-facing copy should stay aligned with this reference.
-->

# Menu Options Reference

## Toolbar popup quick actions

### Open Tab Collector

- Opens or focuses the collector page.
- If the collector is already open, behavior depends on the `openAction`
  setting.

### Save current window

- Saves the current browser window.
- If multiple tabs are highlighted, only the highlighted set is saved.
- If the active tab is inside a browser tab group and no multi-selection is
  active, the group is saved.

### Save current tab

- Saves only the active tab.
- Prefers an existing unlocked and unpinned destination group when available.

### Save current tab group

- Saves every tab in the active Edge tab group.
- Disabled when the active tab is not inside a browser tab group.

### Exclude current website

- Adds the active page hostname to the exclusion list.
- Disabled for internal browser pages, restricted pages, or the collector
  itself.

### Extension options

- Opens the options page.

## Popup compose panel

### Group title

- Optional title for a new saved group.
- Disabled when storing into an existing saved group.

### Destination

- Choose a new saved group or append into an existing one.

### Allow duplicates

- Overrides the default duplicate behavior for that single save.

### Include pinned

- Overrides pinned-tab handling for that single save.

### Filter open tabs

- Narrows the visible tab list in the popup.

### Store selected tabs

- Saves only the checked tab list from the current window.

## Collector page header controls

### Search saved tabs

- Filters saved groups and tabs in place.
- Updates the collector URL query so the current search can be revisited.

### Theme

- Chooses the current named collector palette.
- Available themes today are Griffin, Cobalt, Ember, and Forest.

### Appearance

- Chooses the active appearance mode for the current theme.
- Griffin, Cobalt, Ember, and Forest each support `system`, `light`, and
  `dark`.

### Export format

- Chooses whether collector exports are generated as HTML, JSON, or
  comma-delimited data.

### Export all

- Exports every currently saved group using the selected export format.

### Remove duplicates

- Opens a review dialog that shows duplicate tabs before removal.
- Lets the user uncheck duplicates they want to keep.

### Clear

- Clears the current collector search.

### Options

- Opens the full options page from the collector.

## Collector group actions

### Export

- Exports only the selected saved group using the current export format.

### Pin / Unpin

- Pins matching tabs into Edge's pinned-tab strip when turned on.
- Removes matching pinned browser tabs when turned off.
- Does not intentionally reorder groups in the collector list.

## Page context menu

The extension currently supports these actions from the page context menu:

- Save tab to Tab Collector
- Save tab group to Tab Collector
- Save current window to Tab Collector
- Open Tab Collector
- Exclude website from Tab Collector

Release evidence now validates these registrations through background
diagnostics (`getContextMenuDiagnostics`) during `npm run evidence:edge:strict`.

### Important limitation

Chromium/Edge extension APIs do not currently provide a documented way to place
extension items directly into the native tab-strip or tab-group-header
right-click menus. The implemented right-click integration therefore lives on
the page context menu instead.

## Options page settings

### Collector theme

- Chooses the current named collector palette.

### Theme appearance

- Controls whether the selected theme follows system theme or uses a fixed
  light or dark appearance.

### At browser startup

- Controls whether the collector opens automatically when Edge starts.

### When restoring tabs

- Controls whether restored tabs are removed, kept, or archived in the saved
  list.

### When you click the toolbar icon

- Controls whether the icon saves the window, saves the current tab, or opens
  the popup.

### Duplicates

- Controls whether duplicate normalized URLs are allowed during save operations.

### Pinned tabs

- Controls whether pinned tabs can be saved by default.

### "Open Tab Collector" action

- Controls whether an existing collector tab is switched to or moved into the
  current window.

### URL display

- Controls whether the collector shows no URL, domain-only, abbreviated, or
  full URL display.

### When restoring tabs from the collector page

- Controls whether restoring a single tab keeps focus in the collector or
  switches to the restored tab.

### When restoring a group of tabs

- Controls whether a saved group opens in a new window or the current window.

### Copying links to the clipboard

- Controls how copied links are formatted.

### Right-click inside a web page to access the context menu

- Enables or disables the page context menu integration.

### Save memory immediately when tabs are first opened

- Discards non-active restored tabs after opening to reduce memory pressure.

## Commands and command-like surfaces

- Keyboard command:
  `open-collector` opens the collector page.
- Keyboard command:
  `save-current-tab` saves the active tab.
- Omnibox keyword:
  `11` opens the collector, optionally searching saved groups.
