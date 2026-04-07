<!--
File: GITHUB_BRANCH_GOVERNANCE.md
Created: 2026/04/07
Modified: 2026/04/07
Project: Tab Collector
Repo: tab-collector
Purpose: Document GitHub branch protection rules, security rationale, and
governance mode posture for this repository.
Description: Adapted from the GSS Org-Security-Docs stash draft. Scoped to
tab-collector. Describes what each rule does, the current enforcement state,
and the target posture for strict governance alignment.
Owner: Griffin Software Studios
Author: Codex
Classification: Internal
Security: Do not store secrets, tokens, or credentials.
Redact sensitive values in logs and examples.
Notes: Authoritative for this repo. Source draft lives in
s:/Security/Org-Security-Docs/stash/github-security-overview.md.
-->

# GitHub Branch Governance

## Purpose and scope

This document records the branch protection rules and security governance
posture for the `tab-collector` repository. It explains what each rule does,
why it matters, and which controls are currently active vs. planned.

This document is authoritative for `tab-collector`. The canonical GSS
organization doctrine lives in `s:/Security/Org-Security-Docs/`. When the
two conflict, the org-level doc wins for policy intent; this file wins for
repo-specific configuration state.

---

## Rule explanations and security rationale

### Require a pull request before merging

**What it does:** Blocks direct pushes to `main`; all changes go through PRs.
**Security rationale:** Ensures visibility, review, and CI scanning on every
change before it reaches the default branch.
**Current state:** Active.

### Require status checks to pass

**What it does:** Requires `Node tests` and `Markdown lint` to succeed and
the branch to be up to date with `main` before merge.
**Security rationale:** Prevents broken or non-compliant code from merging.
**Current state:** Active (`strict: true`, both checks required).

### Require code owner review

**What it does:** Requires approval from a CODEOWNERS-designated reviewer.
**Security rationale:** Ensures a known responsible party approves every
change.
**Current state:** Active (`@Astrotheque` owns `*`).

### Dismiss stale reviews on new commits

**What it does:** Invalidates prior approvals when new commits are pushed.
**Security rationale:** Prevents approval-bypassing by pushing changes after
sign-off.
**Current state:** Active.

### Require conversation resolution

**What it does:** Blocks merge until all PR review comments are resolved.
**Security rationale:** Ensures no open concerns are silently bypassed.
**Current state:** Active.

### Block force pushes

**What it does:** Prevents rewriting `main` branch history.
**Security rationale:** Protects forensic integrity and prevents history
tampering.
**Current state:** Active.

### Restrict branch deletion

**What it does:** Prevents deletion of `main`.
**Security rationale:** Protects audit trail and prevents destructive actions.
**Current state:** Active.

### Enforce protections for admins

**What it does:** Applies the same rules to repository admins.
**Security rationale:** Prevents admin bypass of review and CI gates.
**Current state:** Active.

### Require linear history

**What it does:** Disallows merge commits; requires rebase or squash merges.
**Security rationale:** Maintains clean, traceable commit history.
**Current state:** Not yet active. Currently `required_linear_history: false`
in `scripts/github/Set-GitHubStrictGovernance.ps1`. Enabling this is a
planned tightening step — see **Governance gaps** below.

### Require signed commits

**What it does:** Only allows cryptographically signed commits.
**Security rationale:** Prevents identity spoofing; ensures authorship
integrity.
**Current state:** Not active. Deferred; requires committer tooling
alignment before enforcement.

### Restrict branch creations and updates

**What it does:** Prevents unauthorized branch creation or direct pushes to
protected branches.
**Security rationale:** Reduces supply-chain attack surface; enforces
PR-only workflows.
**Current state:** Not active (`block_creations: false`). See **Governance
gaps** below.

### Require code scanning results

**What it does:** Requires CodeQL or equivalent to pass before merging.
**Security rationale:** Detects vulnerabilities before they land on `main`.
**Current state:** Not yet configured for this repository. Planned.

### Automatically request Copilot code review

**What it does:** Adds GitHub Copilot as an automated reviewer on every PR.
**Security rationale:** Ensures consistent review quality and surfaces
automated findings.
**Current state:** Not yet enabled. Planned when available on this account
tier.

---

## Current enforcement state

| Rule | Active | Notes |
| --- | --- | --- |
| Require PR before merge | Yes | |
| Block force pushes | Yes | |
| Restrict deletions | Yes | |
| Require status checks | Yes | Node tests, Markdown lint |
| Require code owner review | Yes | `@Astrotheque` |
| Dismiss stale reviews | Yes | |
| Require conversation resolution | Yes | |
| Enforce protections for admins | Yes | |
| Require linear history | No | Planned |
| Restrict branch creations | No | Planned |
| Require signed commits | No | Deferred |
| Code scanning (CodeQL) | No | Planned |
| Copilot code review | No | Planned |

---

## Governance gaps

The following controls are recognized but not yet active. Each has a
documented reason for deferral.

### Merge commit allowed

`Set-GitHubStrictGovernance.ps1` currently sets `allow_merge_commit=true`.
This permits merge commits alongside squash merges. The intent is squash-only.

- Action: Set `allow_merge_commit=false` in the script and apply.
- Risk: Low. Only affects merge method available to PRs.

### Required linear history not enforced

The branch protection payload sets `required_linear_history: false`. Enabling
this complements the merge-commit setting above.

- Action: Set `required_linear_history: true` after disabling merge commits.
- Risk: Low. Existing history is already linear.

### Branch creation not restricted

`block_creations: false` allows any contributor to create branches. For a
single-maintainer public repo this is currently acceptable, but should be
revisited if collaborators are added.

- Action: Revisit when contributor access expands.

---

## Mode reference (from GSS governance doctrine)

The GSS baseline defines two postures. This table records where
`tab-collector` currently stands against each.

| Rule | Balanced | Strict | Current |
| --- | --- | --- | --- |
| Require PR before merge | Required | Required | Active |
| Block force pushes | Required | Required | Active |
| Restrict deletions | Required | Required | Active |
| Require status checks | Required | Required | Active |
| Require signed commits | Recommended | Mandatory | Deferred |
| Require linear history | Recommended | Mandatory | Planned |
| Restrict creations/updates | Optional | Mandatory | Planned |
| Code scanning results | Required | Required | Planned |
| Code quality results | Optional | Mandatory | Not started |
| Copilot code review | Optional | Enabled | Planned |
| Static analysis integration | Optional | Enabled | Not started |
| Require deployments | Optional | Optional | N/A |

Current posture: **Balanced** (all required controls active; recommended and
mandatory strict controls partially deferred).

Target posture: **Strict** — to be completed before store submission.

---

## Applying or reapplying the governance baseline

Run the repo governance script to reapply the current baseline:

```powershell
pwsh -File scripts/github/Set-GitHubStrictGovernance.ps1 `
  -Repo "Griffin-Software-Studios/tab-collector"
```

When a governance gap above is resolved, update this file and the script
together in the same commit so the record stays in sync with enforcement.
