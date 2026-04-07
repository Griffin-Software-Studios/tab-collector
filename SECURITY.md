<!--
File: SECURITY.md
Created: 2026/03/21
Modified: 2026/03/21
Project: Tab Collector
Repo: tab-collector
Purpose: Publish a repository security disclosure process and baseline policy.
Description: Defines how to report vulnerabilities and what response
behavior to expect.
Owner: Griffin Software Studios
Author: Codex
Classification: Public
Security: Do not include secrets or active exploitation details in public reports.
Notes: Keep this path stable for GitHub security tooling.
-->

# Security Policy

## Supported versions

Security fixes are prioritized for the default branch (`main`) and the latest
published extension package.

## Reporting a vulnerability

Do not open public issues for suspected vulnerabilities.

Report privately through:

- GitHub Security Advisories for this repository, or
- the Griffin Software Studios security contact process

Include:

- affected version/commit
- reproduction steps
- expected impact
- proof-of-concept details (sanitized)

## Response expectations

- Initial acknowledgment target: within 3 business days
- Triage and severity classification: as soon as reproducibility is confirmed
- Fix and disclosure timing: risk-based and coordinated with affected users

## Out-of-scope reports

- issues requiring compromised local machines outside the extension threat model
- generic CSP or browser warnings without reproducible impact
- stale reports without actionable reproduction steps

## Safe harbor

Good-faith, non-destructive security research intended to improve user safety
is welcome.
