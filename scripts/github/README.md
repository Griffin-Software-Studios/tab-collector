# GitHub Governance Scripts

These scripts apply the default Griffin Software Studios (GSS) governance
baseline for repositories in this organization.

## Default bootstrap sequence

From repo root:

```powershell
pwsh -File scripts/github/Set-GitHubStrictGovernance.ps1 -Repo "Griffin-Software-Studios/tab-collector"
pwsh -File scripts/github/Set-GitHubLabels.ps1 -Repo "Griffin-Software-Studios/tab-collector"
```

Recommended order:

1. `Set-GitHubStrictGovernance.ps1`
2. `Set-GitHubLabels.ps1`

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
