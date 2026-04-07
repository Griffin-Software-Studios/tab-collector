<!--
File: CONTRIBUTING.md
Created: 2026/03/21
Modified: 2026/03/21
Project: Tab Collector
Repo: tab-collector
Purpose: Define Git/GitHub contribution standards for this repository.
Description: Captures branch naming, commit metadata requirements, PR gates,
and canonical issue-label baseline aligned to GSS governance standards.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials.
Redact sensitive values in logs and examples.
Notes: Adapted from Org-Security-Docs governance standards.
-->

# Contributing to Tab Collector

## Authority and precedence

When guidance conflicts, use this order:

1. `AGENTS.md`
2. `docs/DOCUMENTATION_CONNECTION_RUBRIC.md`
3. Repository docs in `docs/`
4. Canonical governance in `s:/Security/Org-Security-Docs/`

## Branch naming standard

Use:

- `<type>/<change-domain>`

Rules:

- lowercase only
- kebab-case for `<change-domain>`
- one change domain per branch
- create PR branches from `main`

Allowed branch prefixes:

- `feature/`
- `fix/`
- `hotfix/`
- `refactor/`
- `docs/`
- `test/`
- `chore/`
- `ci/`
- `security/`
- `perf/`

## Commit message standard

Commits are audit artifacts and must include this structure:

```text
<type>(<scope>): <short summary>

Summary:
- <what changed>
Rationale:
- <why the change is needed>
Scope:
- <files, directories, or domains affected>
Risk/impact:
- <low|medium|high> and expected effect
Evidence/approvals:
- <test results, gate outcomes, PR references, approvals>
```

Allowed commit `type` values:

- `docs`
- `build`
- `ci`
- `chore`
- `feat`
- `fix`
- `refactor`
- `test`
- `revert`

## Pull request requirements

Each PR should include:

- change summary and rationale
- connection-rubric self-assessment target (Level 5 preferred)
- risk/impact level
- verification evidence (`npm test`, manual checks, and relevant artifacts)
- governance notes for security/permissions changes

Before opening PR:

```powershell
git fetch origin
git merge-base origin/main HEAD
git diff --name-only origin/main...HEAD
```

## Canonical issue-label baseline

This repository uses the GSS canonical baseline:

| Label | Color | Description |
| --- | --- | --- |
| `bug` | `d73a4a` | Something isn't working |
| `documentation` | `0075ca` | Improvements or additions to documentation |
| `duplicate` | `cfd3d7` | This issue or pull request already exists |
| `enhancement` | `a2eeef` | New feature or request |
| `chore` | `6f42c1` | Maintenance and housekeeping changes |
| `refactor` | `5319e7` | Code or structure changes without behavior change |
| `maintenance` | `fbca04` | Operational upkeep, dependencies, and tooling |
| `good first issue` | `7057ff` | Good for newcomers |
| `help wanted` | `008672` | Extra attention is needed |
| `invalid` | `e4e669` | This doesn't seem right |
| `question` | `d876e3` | Further information is requested |
| `wontfix` | `ffffff` | This will not be worked on |

Apply or repair labels with:

```powershell
pwsh -File scripts/github/Set-GitHubLabels.ps1 -Repo "Griffin-Software-Studios/tab-collector"
```

## Strict repository governance

Apply strict `main` protection and merge-policy settings with:

```powershell
pwsh -File scripts/github/Set-GitHubStrictGovernance.ps1 -Repo "Griffin-Software-Studios/tab-collector"
```

Default bootstrap order for new GSS repositories:

```powershell
pwsh -File scripts/github/Set-GitHubStrictGovernance.ps1 -Repo "Griffin-Software-Studios/tab-collector"
pwsh -File scripts/github/Set-GitHubLabels.ps1 -Repo "Griffin-Software-Studios/tab-collector"
```

Defaults enforced by the script:

- `main` branch protection enabled
- require pull request before merge
- require one approving review
- require CODEOWNERS review
- dismiss stale reviews on new commits
- require status checks (`Node tests`, `Markdown lint`) and up-to-date branch
- require conversation resolution
- block force pushes and branch deletion
- enforce protections for admins

## Governance exceptions policy

Strict governance is the default. Exceptions are allowed only when repository
context requires it (for example, an infra mirror, archived sandbox, or
temporary migration lane).

When applying an exception:

1. Document the exact deviation and rationale in `docs/ENGINEERING_NOTES.md`.
2. Reference the canonical control baseline in
   `s:/Security/Org-Security-Docs/`.
3. Record the approver and date in the same note.
4. Keep the deviation minimal and time-bounded when possible.
