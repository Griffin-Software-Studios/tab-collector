<!--
File: DOCUMENTATION_CONNECTION_RUBRIC.md
Created: 2026/03/14 15:36:43
Modified: 2026/03/14 15:36:43
Project: Tab Collector
Repo: Tabs
Purpose: Define the expected connection depth between code, docs, and governance.
Description: Provides a rubric for deciding whether a change is documented well
enough to be considered connected, reviewable, and release-ready.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials. Redact sensitive values in logs and examples.
Notes: Use this as a review aid, not a substitute for engineering judgment.
-->

# Documentation Connection Rubric

## Purpose

This rubric answers a simple question:

When a code change lands, how connected is it to the rest of the repository?

In this repo, a change is not considered well-connected if it exists only in
code. The change should also appear in the right docs, names, and security
records when relevant.

## Connection levels

| Level | Name | Meaning |
| --- | --- | --- |
| 0 | Isolated | Code changed, but no related documentation or naming review happened |
| 1 | Operational | Code works, but docs and registry updates are missing |
| 2 | Documented | Code and immediate user-facing docs were updated |
| 3 | Traceable | Code, docs, identifiers, and rationale were updated together |
| 4 | Governed | Security/release implications are documented and linked |
| 5 | Release-ready | The change is connected across code, docs, governance, and public-facing repo surfaces |

## Review dimensions

Score each dimension as:

- `0` = not addressed
- `1` = partially addressed
- `2` = fully addressed

| Dimension | Questions |
| --- | --- |
| Behavior | Does the implementation do what the feature claims? |
| Naming | Are IDs, message types, labels, and storage keys normalized or explicitly documented if they drift? |
| User explanation | Can a reviewer tell what changed from README, menu docs, or UI copy? |
| Engineering traceability | Is the change reflected in the function reference or engineering notes if it changes architecture or flow? |
| Governance/security | Are permissions, integrations, or sensitive behavior documented if relevant? |
| Verification | Is there evidence of a syntax check, manual check, or other validation? |

## Minimum targets by change type

### Cosmetic styling changes

- Target: Level 2
- Required documents:
  `README.md` if public-facing
  `docs/ENGINEERING_NOTES.md` if the styling introduces a new system or dependency

### New popup or context-menu action

- Target: Level 3
- Required updates:
  `docs/MENU_OPTIONS_REFERENCE.md`
  `docs/FUNCTION_REFERENCE.md`
  `docs/VARIABLE_NORMALIZATION_REGISTRY.md` if new IDs or messages are added

### New storage setting or normalization rule

- Target: Level 3
- Required updates:
  `shared.js`
  `docs/VARIABLE_NORMALIZATION_REGISTRY.md`
  `docs/MENU_OPTIONS_REFERENCE.md` if user-facing

### New permission, external integration, or public trust claim

- Target: Level 4 or 5
- Required updates:
  `manifest.json`
  `README.md`
  `docs/ENGINEERING_NOTES.md`
  `security/ai-integrations/` or another security record when applicable

## Connection checklist

Use this short checklist before calling a change complete:

1. Behavior is implemented and validated.
2. User-facing labels and internal IDs are either aligned or the drift is documented.
3. The relevant local docs were updated.
4. Security/governance implications are recorded if the change affects permissions, data handling, or release posture.
5. The README reflects the change if an outside reader would care.

## Current repository gaps

This rubric exists because the repo is still maturing. Current high-value areas
for stronger connection are:

- variable normalization
- popup/context-menu naming consistency
- function-level architecture references
- store-prep documentation and preview evidence
