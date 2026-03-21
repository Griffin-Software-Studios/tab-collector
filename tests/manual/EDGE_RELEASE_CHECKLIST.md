# Edge Release Checklist

Generated: 2026-03-14T22:05:43.221Z

Edge version path:
`C:\Program Files (x86)\Microsoft\Edge\Application\msedge.exe`

Extension ID: `fplmoeljaafoanjabjhloolomhkfbhbl`

## Captured evidence

- Collector page: `tests/assets/screenshots/collector-page-edge.png`
- Options page: `tests/assets/screenshots/options-page-edge.png`
- Popup page: `tests/assets/screenshots/popup-page-edge.png`

## Checks

| Check | Status | Notes |
| --- | --- | --- |
| options-page | passed | Renders settings grid, excluded domains, commands |
| collector-page | passed | Renders summary cards and saved groups from seed |
| collector-theme-selection | passed | Griffin appearance switches dark/light |
| popup-page | passed | Renders quick actions, selected tabs, and quick list |
| page-context-menu | manual-follow-up | Requires live right-click validation |
| native-tab-strip-menu | not-applicable | Unsupported by documented APIs |
