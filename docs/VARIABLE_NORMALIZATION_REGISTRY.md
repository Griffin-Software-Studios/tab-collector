<!--
File: VARIABLE_NORMALIZATION_REGISTRY.md
Created: 2026/03/14 15:36:43
Modified: 2026/03/14 15:36:43
Project: Tab Collector
Repo: Tabs
Purpose: Record naming conventions and key identifiers used by the extension.
Description: Establishes a first-pass normalization registry for storage keys,
message types, menu IDs, and user-facing naming drift inside the repo.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials.
Redact sensitive values in logs and examples.
Notes: Starter registry. Expand as code surfaces stabilize.
-->

# Variable Normalization Registry

## Purpose

This file is the project-local equivalent of a variable and identifier map. It
does not replace the org-wide variable standard. It documents how this
extension names things today and where naming drift still exists.

## Normalization rules

| Domain | Canonical pattern | Notes |
| --- | --- | --- |
| Storage roots | `lowerCamelCase` | Example: `excludedDomains` |
| Settings keys | `lowerCamelCase` | Defined in `shared.js` |
| Runtime message types | `lowerCamelCase` | Verb-first action names |
| Context menu IDs | `kebab-case` | Browser-facing identifiers |
| Popup `data-action` values | `kebab-case` | UI action routing |
| CSS theme tokens | `--gs-*` | Griffin/GSS tokens |
| Local CSS aliases | short `--*` names | Allowed only where already in use |

## Storage registry

### Root storage keys

| Key | Type | Meaning |
| --- | --- | --- |
| `settings` | object | Extension behavior settings |
| `groups` | array | Saved tab groups |
| `excludedDomains` | array | Domain block list for capture filtering |

### Settings keys

| Key | Meaning |
| --- | --- |
| `theme` | Named collector palette selection |
| `themeMode` | Appearance override for themes supporting light/dark variants |
| `startupBehavior` | Whether to open the collector at startup |
| `restoreBehavior` | Remove, keep, or archive behavior after restore |
| `toolbarAction` | What clicking the toolbar icon does |
| `duplicates` | Duplicate-handling mode |
| `includePinned` | Whether pinned tabs may be saved |
| `openAction` | How the collector tab is reopened/focused |
| `urlDisplay` | URL presentation mode in the collector |
| `restoreTabFocus` | Whether restore changes focus |
| `restoreGroupDestination` | Current-window vs new-window group restore |
| `clipboardFormat` | Copy formatting preference |
| `contextMenuEnabled` | Whether page context-menu integration is enabled |
| `saveMemoryOnRestore` | Whether restored background tabs are discarded |

## Runtime message registry

| Message type | Purpose |
| --- | --- |
| `openCollector` | Focus or open the collector page |
| `saveCurrentWindow` | Save the current window or inferred selection |
| `saveCurrentTab` | Save only the active tab |
| `saveCurrentGroup` | Save the active browser tab group |
| `saveSelectedTabs` | Save an explicit set of tab IDs |
| `restoreGroup` | Restore a saved group |
| `restoreTab` | Restore one saved tab |
| `toggleGroupFlag` | Toggle `archived`, `locked`, or `pinned` |
| `renameGroup` | Update the group title |
| `updateGroupNotes` | Update group notes |
| `deleteGroup` | Remove a saved group |
| `deleteTab` | Remove a saved tab from a group |
| `excludeDomain` | Add a host to the exclusion list |

## Menu and UI action registry

### Context menu IDs

| ID | User-facing label |
| --- | --- |
| `open-collector` | Open Tab Collector |
| `save-current-window` | Save current window to Tab Collector |
| `save-current-tab` | Save tab to Tab Collector |
| `save-current-group` | Save tab group to Tab Collector |
| `exclude-site` | Exclude website from Tab Collector |

### Popup `data-action` values

| Action | User-facing label |
| --- | --- |
| `open-collector` | Open Tab Collector |
| `save-window` | Save current window |
| `save-tab` | Save current tab |
| `save-group` | Save current tab group |
| `exclude-site` | Exclude current website |
| `open-options` | Extension options |
| `open-saved-group` | Open a saved group search in the collector |

### Shared registries

These registries now define the project's public action contract in `shared.js`:

- `TOOLBAR_ACTIONS`
- `MESSAGE_TYPES`
- `POPUP_ACTIONS`
- `CONTEXT_MENU_IDS`
- `COMMAND_IDS`

## Known drift and cleanup targets

### Legacy compatibility

The main identifiers are now normalized around `save`, but the repo still keeps
limited compatibility logic for older local settings values:

- legacy toolbar action values:
  `send-window` -> `save-window`
- legacy toolbar action values:
  `send-current` -> `save-current`

Current normalization stance:

- use `save*` for runtime message types, internal save functions, and
  user-facing actions
- use `save-*` for action IDs, menu IDs, and keyboard command IDs where
  kebab-case is required
- keep only the minimal legacy settings migration needed for persisted local state

### Theme token duality

`tabs.css` and `popup.css` still carry local aliases such as `--bg`,
`--panel`, and `--text` while also adopting Griffin `--gs-*` tokens.

Normalization target:

- prefer `--gs-*` as the canonical theme layer
- keep local aliases only when they reduce churn in existing CSS

### Theme contract split

The current theme contract is intentionally two-part:

- `theme`
  selects the named palette (`griffin`, `cobalt`, `ember`, `forest`)
- `themeMode`
  selects the appearance variant when the chosen theme supports one

Current behavior:

- `griffin`, `cobalt`, `ember`, and `forest` support `system`, `light`, and
  `dark`

## Reference linkages

When adding or renaming identifiers, review these files in the same change:

- `shared.js`
- `background.js`
- `popup.js`
- `docs/FUNCTION_REFERENCE.md`
- `docs/MENU_OPTIONS_REFERENCE.md`
- `docs/DOCUMENTATION_CONNECTION_RUBRIC.md`
