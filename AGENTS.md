<!--
File: AGENTS.md
Created: 2026/03/14 15:36:43
Modified: 2026/03/14 15:36:43
Project: Tab Collector
Repo: tab-collector
Purpose: Define repository-specific contribution and automation rules.
Description: Adapts the organization security-documents AGENTS guidance to the
Edge extension codebase, documentation set, and release-preparation workflow.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials.
Redact sensitive values in logs and examples.
Notes: This file is intentionally repo-scoped and should be updated only by
explicit request.
-->

# AGENTS.md - Tab Collector Repository Rules

## 1) Authority and precedence

When guidance conflicts, use the following order:

1. Direct user instruction for the current task
2. This repository's `AGENTS.md`
3. Repository-local reference docs under `docs/` and `security/`
4. Canonical organization references in `s:/Security/Org-Security-Docs/`
5. Existing code and runtime constraints in this repository

The Org-Security-Docs repository is authoritative for governance patterns and
security posture. This repository remains authoritative for its own code,
runtime decisions, and release packaging.

## 2) Repository scope

This repository is a Microsoft Edge Manifest V3 extension with these primary
surfaces:

- `background.js` for capture, restore, routing, and context-menu behavior
- `popup.html` and `popup.js` for toolbar workflows
- `collector.html` and `collector.js` for saved-tab management
- `options.html` and `options.js` for configuration
- `shared.js` for shared state, defaults, and normalization utilities

## 3) Security posture

All work assumes:

- user tab titles, notes, and URLs may be sensitive
- browser state is not inherently trustworthy
- minimal permissions are preferred over convenience
- evidence is required for external security claims
- browser/API limitations must be documented, not hand-waved

Non-negotiable rules:

- Do not add secrets, tokens, credentials, or live endpoints to the repo.
- Do not claim store readiness, compliance, or security guarantees without
  documented evidence.
- Treat new permissions, network calls, and storage expansion as security
  events that require documentation.

## 4) Change discipline

Prefer single-purpose changes. Keep behavior, docs, and security records in
sync.

When changing one of these surfaces, update the linked docs in the same change
when feasible:

- Menu or quick action behavior:
  `docs/MENU_OPTIONS_REFERENCE.md`
- Message routes, capture flows, or restore flows:
  `docs/FUNCTION_REFERENCE.md`
- Naming, IDs, storage keys, or message types:
  `docs/VARIABLE_NORMALIZATION_REGISTRY.md`
- Cross-surface traceability expectations:
  `docs/DOCUMENTATION_CONNECTION_RUBRIC.md`
- Architectural constraints or platform limitations:
  `docs/ENGINEERING_NOTES.md`

## 5) Naming and normalization

Use these patterns unless an existing file clearly establishes another one:

- JS constants for registries: `UPPER_SNAKE_CASE`
- JS runtime names and storage keys: `lowerCamelCase`
- Message types: `lowerCamelCase`
- Menu IDs, DOM IDs, and `data-action` values: `kebab-case`
- CSS custom properties:
  `--gs-*` for Griffin theme tokens and short local aliases only when already
  present

If user-facing wording changes without a code rename, document the mismatch in
`docs/VARIABLE_NORMALIZATION_REGISTRY.md`.

## 6) Documentation and preview assets

This repo is being prepared for public-facing use and possible store
submission. That means:

- README changes should optimize for fast understanding by an external reader.
- Preview assets in `docs/assets/` must not imply functionality the extension
  does not actually have.
- If a preview is illustrative rather than a live screenshot, label it as a
  preview in the surrounding documentation.

## 7) Release and store-preparation rules

Before public release or store submission:

- verify manifest permissions are justified and documented
- document any unsupported native browser integration points
- review all internal-only references for suitability
- replace illustrative previews with real operational screenshots if available
- ensure AI-assisted development records are present and current if required by
  governance

## 8) AI-assisted development records

If AI materially contributes to code, architecture, or documentation:

- update `security/ai-integrations/`
- keep the record metadata-only
- avoid recording secrets, raw prompts containing sensitive data, or local
  machine identifiers
- avoid marking approvals stronger than what is actually known

## 9) AGENTS.md change control

This file is a governance control file for this repository.

- Do not modify it as part of unrelated work.
- Changes require explicit user request.
- Keep changes scoped, reviewable, and justified.
