<!--
File: STATE_OF_AFFAIRS.md
Created: 2026/03/15
Modified: 2026/03/15
Project: Tab Collector
Repo: Tabs
Purpose: Capture a concise engineering handoff snapshot for the current repo state.
Description: Summarizes what is working now, what changed recently, and the
most likely next steps.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials.
Redact sensitive values in logs and examples.
Notes: This is a point-in-time handoff note, not a backlog system.
-->

# State of Affairs

Snapshot date: 2026-03-15

## Current status

- Automated tests currently pass: `49/49`
- Core surfaces remain active and aligned:
  `popup.html`, `collector.html`, `options.html`, and `background.js`
- The current working directory does not expose `.git` metadata, so `git status`
  is unavailable from `s:\Dev\Tabs`

## Recently completed work

### Theme contract

- Theme selection is now split into `theme` and `themeMode`
- Griffin supports `system`, `light`, and `dark`
- Cobalt, Ember, and Forest were imported from GSS Pass Gen and currently stay
  on their authored dark/base palette

### Collector page

- The hero panel now contains search, theme, appearance, export format,
  `Export all`, `Remove duplicates`, `Clear`, `Options`, and inline status
- The search field now spans the top row above the theme selectors so it does
  not collapse when extra controls are present
- Duplicate removal now opens a selection dialog so duplicates can be reviewed
  before deletion
- Delete and remove actions use a themed confirmation overlay
- Pin and unpin now target real browser pinned tabs and preserve scroll
  position instead of resetting the collector view

### Documentation and evidence

- The theme and collector docs are now being updated to reflect the named-theme
  contract
- The manual Edge evidence script has been moved to the current Griffin theme +
  appearance control flow

## Files to start with next time

- [theme.js](../theme.js)
- [shared.js](../shared.js)
- [collector.js](../collector.js)
- [tabs.css](../tabs.css)
- [tests/manual/capture-edge-evidence.js](../tests/manual/capture-edge-evidence.js)
- [docs/MENU_OPTIONS_REFERENCE.md](./MENU_OPTIONS_REFERENCE.md)

## Most likely next steps

1. Draft a commit plan for uncommitted work. Break it into reviewable chunks
   and self-assess each using the documentation connection rubric. Target
   Level 5 (Release-ready): code, docs, governance, and public surfaces all
   addressed. Include function reference updates, user-facing doc updates,
   and clear evidence in commit messages. Document decisions in engineering
   notes.
2. Add light and dark variants for Cobalt, Ember, and Forest.
3. Continue manual tablet/mobile resizing passes on collector group layouts.
4. Refresh Edge evidence after the manual script changes are validated in a
   live session.
