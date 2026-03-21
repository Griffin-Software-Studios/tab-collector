<!--
File: STATE_OF_AFFAIRS.md
Created: 2026/03/15
Modified: 2026/03/15
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

Snapshot date: 2026-03-15

## Current status

- Automated tests currently pass: `49/49`
- Core surfaces remain active and aligned:
  `popup.html`, `collector.html`, `options.html`, and `background.js`
- The current working directory does not expose `.git` metadata, so `git status`
  is unavailable from `s:\Dev\Tabs`

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

## Files to start with next time

- [theme.js](../theme.js)
- [shared.js](../shared.js)
- [collector.js](../collector.js)
- [tabs.css](../tabs.css)
- [tests/manual/capture-edge-evidence.js](../tests/manual/capture-edge-evidence.js)
- [docs/MENU_OPTIONS_REFERENCE.md](./MENU_OPTIONS_REFERENCE.md)

## Most likely next steps

1. Draft a commit plan for the work that has been done but not yet committed, then break it into reviewable chunks and link to the relevant docs and evidence updates. When possible, use the documentation connection rubric to self-assess the connection level of each chunk and identify any gaps before review. Keep in mind that the goal is to reach Level 5 (Release-ready) for each chunk, which means the change should be connected across code, docs, governance, and public-facing repo surfaces. Use the review dimensions to ensure that behavior, naming, user explanation, engineering traceability, governance/security, and verification are all adequately addressed in each chunk. Each chunk should ideally include updates to the function reference, documentation connection rubric, and any relevant user-facing docs to ensure that reviewers can easily understand the change and its implications. Commit and push each chunk with clear messages that reference the related docs and evidence, and be prepared to iterate based on reviewer feedback to achieve a well-connected change. Codex can assist in drafting commit messages, identifying relevant docs for updates, and suggesting improvements to connection levels based on the rubric. Document any decisions made during this process in the engineering notes for future reference. Each commit should be self-contained and focused on a specific aspect of the recent work, such as theme contract updates, collector page enhancements, or documentation improvements. This approach will help reviewers provide targeted feedback and ensure that each change is thoroughly vetted before being merged into the main branch. The assessment of connection levels should be honest and critical, aiming to identify any areas where the change may not be fully connected and addressing those gaps before review. The ultimate goal is to ensure that each change is not only functional but also well-documented, traceable, and ready for release with clear explanations for users and maintainers alike. Commit messages should reference the specific docs that were updated, such as the function reference for any code changes, the documentation connection rubric for any changes that affect how changes are connected, and user-facing docs for any changes that impact the user experience. This will help reviewers understand the full context of each change and how it fits into the overall state of the project. Additionally, any relevant evidence, such as test results or manual validation steps, should be included in the commit messages or linked in the engineering notes to provide a clear record of how the change was verified. This comprehensive approach to committing and documenting changes will help ensure that the project remains well-organized and that future maintainers can easily understand the history and rationale behind each change. Following governance best practices and maintaining a high level of connection across code, docs, and governance will contribute to the long-term success and maintainability of the project. By systematically addressing each aspect of the change and ensuring that it is well-connected, we can facilitate smoother reviews, better documentation, and a more robust codebase that is easier to maintain and extend in the future. PR reviews will be carried out with an eye toward identifying any gaps in connection levels and providing constructive feedback to help achieve Level 5 (Release-ready) for each change. Reviewers should reference the documentation connection rubric during their review process to ensure that all relevant dimensions are adequately addressed and that the change is well-connected across code, docs, governance, and public-facing surfaces. The goal of the review process is not only to catch any issues but also to help improve the overall quality and connection of each change, ensuring that it is ready for release and well-understood by both users and maintainers. By following this structured approach to committing, documenting, and reviewing changes, we can maintain a high standard of quality and connection in the project, ultimately leading to a better experience for users and a more maintainable codebase for developers.
2. Add light and dark variants for Cobalt, Ember, and Forest.
3. Continue manual tablet/mobile resizing passes on collector group layouts.
4. Refresh Edge evidence after the manual script changes are validated in a live session.
