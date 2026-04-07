<!--
File: FUNCTION_REFERENCE.md
Created: 2026/03/14 15:36:43
Modified: 2026/03/14 15:36:43
Project: Tab Collector
Repo: tab-collector
Purpose: Document the main functions and entry points in the extension.
Description: Provides a starter reference for capture, restore, state, and UI
flows so code changes can be connected to the right surfaces and docs.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials.
Redact sensitive values in logs and examples.
Notes: This is intentionally selective. It focuses on public behavior and key
entry points.
-->

# Function Reference

## Background service worker

### Routing and bootstrap

| Function | Purpose |
| --- | --- |
| `bootstrap()` | Initializes defaults, popup behavior, and context menus |
| `handleMessage(message, sender)` | Central runtime message dispatcher |
| `openCollector()` | Opens or focuses the collector tab |
| `syncContextMenus()` | Rebuilds extension page context menus |
| `performContextMenuStateSync()` | Syncs state-dependent menu item access |

### Runtime message routes

| Message type | Target implementation |
| --- | --- |
| `saveCurrentWindow` | `captureCurrentWindow()` |
| `saveCurrentTab` | `captureCurrentTab()` |
| `saveCurrentGroup` | `captureCurrentGroup()` |
| `saveSelectedTabs` | `captureSelectedTabs()` |
| `excludeDomain` | `addExcludedDomainFromUrl()` |
| `openCollector` | `openCollector()` |

### Capture flows

| Function | Purpose |
| --- | --- |
| `captureCurrentWindow()` | Captures highlighted tabs, active group, or tabs |
| `captureCurrentTab()` | Captures active tab and prefers eligible destination |
| `captureCurrentGroup()` | Captures every tab in the active browser tab group |
| `captureSelectedTabs()` | Captures an explicit set of tab IDs from the popup |
| `captureTabs()` | Shared capture pipeline for filtering, dedupe, and storage |
| `getWindowCaptureTabs()` | Resolves selected tabs, active group, or window |

### Restore and group mutation

| Function | Purpose |
| --- | --- |
| `restoreGroup()` | Restores a whole saved group |
| `restoreTab()` | Restores a single saved tab |
| `openStoredTabs()` | Reopens saved tabs in a current or new window |
| `toggleGroupFlag()` | Toggles group flags and syncs browser pinned-tab state |
| `renameGroup()` | Renames a saved group |
| `updateGroupNotes()` | Writes notes to a saved group |
| `deleteGroup()` | Deletes a saved group |
| `deleteTab()` | Deletes one tab from a saved group |
| `addExcludedDomainFromUrl()` | Adds a host to the exclusion list |

## Popup

### Initialization and default selection

| Function | Purpose |
| --- | --- |
| `initialize()` | Loads state/current-window tabs, then renders popup UI |
| `getDefaultSelection()` | Picks default tabs from highlight/group state |
| `renderDestinationOptions()` | Populates the destination-group selector |
| `renderTabs()` | Renders the current-window tab checklist |
| `renderQuickList()` | Renders recent saved groups |

### Popup actions

| Function | Purpose |
| --- | --- |
| `handleClick()` | Routes all popup button actions |
| `storeSelectedTabs()` | Captures the selected tab set |
| `syncQuickActions()` | Enables and explains state-dependent quick actions |
| `getExcludableHost()` | Determines whether the active page can be excluded |

## Collector page

### Rendering and interaction

| Function | Purpose |
| --- | --- |
| `renderShell()` | Builds collector shell, hero controls, and summary cards |
| `buildGroupCard()` | Builds one group card with badges and actions |
| `renderGroups()` | Renders saved groups into the collector |
| `attachEvents()` | Wires collector actions and inline editing behavior |
| `applyTheme()` | Applies the selected theme and appearance contract |
| `syncThemeControls()` | Keeps theme and appearance selectors in sync |
| `openDuplicateSelection()` | Opens duplicate-review dialog with confirmation |

The collector is UI-heavy and will need deeper documentation later if the page
keeps growing.

## Shared state and utilities

| Function | Purpose |
| --- | --- |
| `loadState()` | Loads settings, groups, and exclusions from local storage |
| `saveState()` | Persists the full local extension state |
| `ensureGroupShape()` | Normalizes saved group records when loading |
| `normalizeUrl()` | Strips hash fragments for duplicate detection |
| `getHostname()` | Returns a normalized hostname for display and filtering |
| `isRestrictedUrl()` | Filters unsupported browser/internal URLs |
| `isCollectorUrl()` | Detects the extension's collector page |
| `makeGroup()` | Creates a new saved group record |
| `makeTabRecord()` | Creates a saved tab record |
| `updateGroupTimestamp()` | Refreshes `updatedAt` after a group mutation |

## Documentation triggers

Update this file when:

- a new runtime message is added
- capture or restore behavior changes
- a new user-visible action becomes a primary workflow
- a state-mutating function gains security or release significance
