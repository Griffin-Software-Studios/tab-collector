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

For repositories with one active contributor, the auto-approve workflow
at `.github/workflows/auto-approve.yml` satisfies the review requirement
automatically. When a PR is opened or updated by the sole contributor,
`github-actions[bot]` submits an approving review so the owner can merge
without a separate reviewer.

Required status checks and conversation resolution are still enforced.
`require_code_owner_reviews` is set to `false` in the protection payload
so the bot approval counts toward the required review count.

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
