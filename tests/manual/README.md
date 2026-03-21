# Manual Validation Assets

This folder contains repo-local manual and assisted validation material for
Edge release checks.

Contents here are intentionally separated from the extension package:

- scripts used to generate release evidence
- checklist output
- runtime scratch data for browser-assisted validation

The packaged extension excludes the entire `tests/` tree.

To refresh the current evidence set:

```powershell
npm run evidence:edge
```
