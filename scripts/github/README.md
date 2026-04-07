# GitHub Governance Scripts

These scripts apply the default Griffin Software Studios (GSS) governance
baseline for repositories in this organization.

## Default bootstrap sequence

From repo root:

```powershell
pwsh -File scripts/github/Set-GitHubStrictGovernance.ps1 `
  -Repo "Griffin-Software-Studios/tab-collector"
pwsh -File scripts/github/Set-GitHubLabels.ps1 `
  -Repo "Griffin-Software-Studios/tab-collector"
```

Recommended order:

1. `Set-GitHubStrictGovernance.ps1`
2. `Set-GitHubLabels.ps1`

## Single-contributor provision

For repositories with one active contributor, pass `-BypassUsers` so the
owner can merge their own pull requests when CI passes and all review
threads are resolved:

```powershell
pwsh -File scripts/github/Set-GitHubStrictGovernance.ps1 `
  -Repo "Griffin-Software-Studios/tab-collector" `
  -BypassUsers @("Astrotheque")
```

This adds the named user to `bypass_pull_request_allowances`. Required
status checks and conversation resolution are still enforced for all actors.

## What they enforce

- strict branch protection on `main`
- merge policy baseline
- canonical issue-label baseline
- fail-fast behavior on GitHub API/repo access errors

## Exceptions

Strict mode is the default. If an exception is required, document it in:

- `docs/ENGINEERING_NOTES.md`

Include rationale, approver, and date, and reference canonical controls in:

- `s:/Security/Org-Security-Docs/`
