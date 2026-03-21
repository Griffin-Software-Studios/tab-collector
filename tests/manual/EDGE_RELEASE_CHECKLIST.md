# Edge Release Checklist

Generated: 2026-03-21T05:59:44.797Z

Edge version path: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

Extension ID: `fplmoeljaafoanjabjhloolomhkfbhbl`

## Captured evidence

- Collector page: `tests/assets/screenshots/collector-page-edge.png`
- Collector page (tablet): `tests/assets/screenshots/collector-page-tablet-edge.png`
- Collector page (mobile): `tests/assets/screenshots/collector-page-mobile-edge.png`
- Options page: `tests/assets/screenshots/options-page-edge.png`
- Popup page: `tests/assets/screenshots/popup-page-edge.png`

## Checks

| Check | Status | Notes |
| --- | --- | --- |
| options-page | passed | Options page renders settings grid, excluded domains, and command list |
| collector-page | passed | Collector page renders summary cards and saved groups from seeded state |
| collector-theme-selection | passed | Collector Griffin appearance selection switches between dark and light modes |
| collector-tablet-layout | passed | Collector tablet layout stacks each group header and keeps controls inside the viewport |
| collector-mobile-layout | passed | Collector mobile layout keeps controls and URLs wrapped without horizontal overflow |
| popup-page | passed | Popup page renders quick actions, selected tab list, and quick list |
| page-context-menu | manual-follow-up | Page context menu entries require live right-click validation in an interactive Edge session |
| native-tab-strip-menu | not-applicable | Native tab-strip and tab-group header integration remains unsupported by the documented Edge extension API surface |
