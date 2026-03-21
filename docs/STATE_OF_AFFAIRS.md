<!--
File: STATE_OF_AFFAIRS.md
Created: 2026/03/15
Modified: 2026/03/21
Project: Tab Collector
Repo: Tabs
Purpose: Capture a concise engineering handoff snapshot for the current repo state.
Description: Summarizes what is working now, what changed recently, and the most likely next steps.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials. Redact sensitive values in logs and examples.
Notes: This is a point-in-time handoff note, not a backlog system.
-->

# State of Affairs

Snapshot date: 2026-03-21

## Current status

- Automated tests currently pass: `49/49`
- Core surfaces remain active and aligned:
  `popup.html`, `collector.html`, `options.html`, and `background.js`
- Local git metadata is available and healthy from `s:\Dev\Tabs`
- Public repo target is live as `Griffin-Software-Studios/tab-collector`
- Strict governance baseline is now applied and verified on remote `main`

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

### Repository governance bootstrap

- A strict repository bootstrap was completed for
  `Griffin-Software-Studios/tab-collector`
- Baseline governance scripts now fail fast when `gh` cannot access the target
  repository, preventing false-success output on API 404/permission failures
- Strict branch protection for `main` was applied and verified, including:
  required status checks, required review approval, code-owner review, stale
  review dismissal, conversation resolution, and admin enforcement
- Canonical GSS label set was applied successfully

## Files to start with next time

- [theme.js](../theme.js)
- [shared.js](../shared.js)
- [collector.js](../collector.js)
- [tabs.css](../tabs.css)
- [tests/manual/capture-edge-evidence.js](../tests/manual/capture-edge-evidence.js)
- [docs/MENU_OPTIONS_REFERENCE.md](./MENU_OPTIONS_REFERENCE.md)

## Most likely next steps

1. Keep strict governance scripts as the default bootstrap path for future GSS
   repos and document any org-specific exceptions.
2. Add light and dark variants for Cobalt, Ember, and Forest.
3. Continue manual tablet/mobile resizing passes on collector group layouts.
4. Refresh Edge evidence after the manual script changes are validated in a live
   session.
5. Stage remaining changes into reviewable chunks and assess each chunk against
   `docs/DOCUMENTATION_CONNECTION_RUBRIC.md` before PR.
