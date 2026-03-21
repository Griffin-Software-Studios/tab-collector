# Edge Release Checklist

Generated: 2026-03-14T22:05:43.221Z

Edge version path: `C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

Extension ID: `fplmoeljaafoanjabjhloolomhkfbhbl`

## Captured evidence

- Collector page: `tests/assets/screenshots/collector-page-edge.png`
- Options page: `tests/assets/screenshots/options-page-edge.png`
- Popup page: `tests/assets/screenshots/popup-page-edge.png`

## Checks

| Check | Status | Notes |
| --- | --- | --- |
| options-page | passed | Options page renders settings grid, excluded domains, and command list |
| collector-page | passed | Collector page renders summary cards and saved groups from seeded state |
| collector-theme-selection | passed | Collector Griffin appearance selection switches between dark and light modes |
| popup-page | passed | Popup page renders quick actions, selected tab list, and quick list |
| page-context-menu | manual-follow-up | Page context menu entries require live right-click validation in an interactive Edge session |
| native-tab-strip-menu | not-applicable | Native tab-strip and tab-group header integration remains unsupported by the documented Edge extension API surface |
