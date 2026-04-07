# Tab Collector Brand Media Inventory

This folder contains Tab Collector brand assets used by extension UI, manifest
icons, and packaging/export workflows.

## Asset catalog

### `tab-collector-64.png`

![tab-collector-64 preview](./tab-collector-64.png)

- Format: PNG
- Dimensions: `64x64`
- Typical usage: primary small icon for browser/favicon surfaces
- Current references:
  - `manifest.json` icon slots `16`, `32`, `48`
  - favicon links in `popup.html`, `options.html`, `collector.html`

### `tab-collector-128.png`

![tab-collector-128 preview](./tab-collector-128.png)

- Format: PNG
- Dimensions: `128x128`
- Typical usage: primary medium icon for extension/app surfaces
- Current references:
  - `manifest.json` icon slot `128`
  - `action.default_icon.128`
  - popup header logo
  - options hero logo
  - collector hero logo

### `tab-collector-256.png`

![tab-collector-256 preview](./tab-collector-256.png)

- Format: PNG
- Dimensions: `256x256`
- Typical usage: high-resolution docs/store asset
- Current runtime wiring: not wired directly to manifest/HTML

### `tab-collector-512.png`

![tab-collector-512 preview](./tab-collector-512.png)

- Format: PNG
- Dimensions: `512x512`
- Typical usage: store assets and downscaled derivatives
- Current runtime wiring: not wired directly to manifest/HTML

### `tab-collector-master-1000.png`

- Format: PNG
- Dimensions: `1000x1000`
- Typical usage: master raster source for generating derivatives

### `tab-collector-exact.svg`

- Format: SVG (embedded image)
- Dimensions: `1000x1000` (`viewBox`)
- Typical usage: scalable docs/export media preserving exact art treatment

## Current runtime references

- `manifest.json`
  - `icons.16/32/48 -> assets/brand/tab-collector-64.png`
  - `icons.128 -> assets/brand/tab-collector-128.png`
  - `action.default_icon.16/32/48 -> assets/brand/tab-collector-64.png`
  - `action.default_icon.128 -> assets/brand/tab-collector-128.png`
- `popup.html`, `options.html`, `collector.html`
  - favicon link -> `assets/brand/tab-collector-64.png`
- `popup.html`, `options.html`, `collector.js`
  - header/hero logo -> `assets/brand/tab-collector-128.png`

## Selection guidance

- Use `64` and `128` for runtime surfaces where manifest/UI expect those sizes.
- Use `256` and `512` for high-density docs/store assets when SVG is not
  desired.
- Use `tab-collector-master-1000.png` or `tab-collector-exact.svg` as the
  source of truth when generating new derivatives.
