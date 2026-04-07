<!--
File: README.md
Created: 2026/03/14 15:36:43
Modified: 2026/03/14 15:36:43
Project: Tab Collector
Repo: Tabs
Purpose: Provide a documentation registry for the Tab Collector repository.
Description: Links the initial project docs, governance overlays, engineering
notes, and local security records to their intended usage.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials.
Redact sensitive values in logs and examples.
Notes: This is a project-local registry, not a copy of Org-Security-Docs
canonical content.
-->

# Documentation Registry

This directory is the starting point for project-level documentation that sits
next to the extension codebase.

## Local project documents

- [Variable Normalization Registry](./VARIABLE_NORMALIZATION_REGISTRY.md)
- [Function Reference](./FUNCTION_REFERENCE.md)
- [Menu Options Reference](./MENU_OPTIONS_REFERENCE.md)
- [Documentation Connection Rubric](./DOCUMENTATION_CONNECTION_RUBRIC.md)
- [Engineering Notes](./ENGINEERING_NOTES.md)
- [State of Affairs](./STATE_OF_AFFAIRS.md)

## Local security records

- [`../security/ai-integrations/README.md`](../security/ai-integrations/README.md)
- [`../security/ai-integrations/ai-int-2026-03-14-001.yaml`](../security/ai-integrations/ai-int-2026-03-14-001.yaml)

## Validation evidence

- [`../tests/manual/EDGE_RELEASE_CHECKLIST.md`](../tests/manual/EDGE_RELEASE_CHECKLIST.md)
- [`../tests/assets/README.md`](../tests/assets/README.md)

## Internal governance references

These files remain canonical in `s:/Security/Org-Security-Docs/` and should be
used as references instead of copied doctrine:

- `AGENTS.md`
- `core-controls/standards/SECURITY_DOCTRINE.md`
- `core-controls/standards/HEADER_GOVERNANCE.md`
- `core-controls/standards/VARIABLES.md`
- `core-controls/standards/TRUST_COMMUNICATION_POLICY.md`
- `core-controls/structure/DOCUMENTATION_STRUCTURE.md`
- `core-controls/projects/PROJECT_TEMPLATE.md`
- `ai-integrations/ai-integration-record.example.yaml`
- `ai-integrations/ai-int-2026-02-10-001.yaml`

## Intended use

Use this docs set for:

- project-local implementation references
- naming and normalization cleanup
- documentation sync rules
- release/store preparation notes
- repo-scoped security and AI-assisted development records

Do not use this directory to duplicate organization-wide doctrine. Link back to
canonical sources when the project only needs an overlay or interpretation.
