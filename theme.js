export const THEME_MODES = Object.freeze({
  SYSTEM: "system",
  LIGHT: "light",
  DARK: "dark"
});

export const THEME_IDS = Object.freeze({
  GRIFFIN: "griffin",
  COBALT: "cobalt",
  EMBER: "ember",
  FOREST: "forest"
});

export const THEMES = Object.freeze([
  {
    id: THEME_IDS.GRIFFIN,
    label: "Griffin",
    description: "Griffin Software Studios styling with system, light, and dark appearance modes.",
    supportsMode: true,
    colorScheme: "light dark"
  },
  {
    id: THEME_IDS.COBALT,
    label: "Cobalt",
    description: "Deep blue glass panels with signal amber accents.",
    supportsMode: false,
    colorScheme: "dark"
  },
  {
    id: THEME_IDS.EMBER,
    label: "Ember",
    description: "Warm copper highlights on a graphite base.",
    supportsMode: false,
    colorScheme: "dark"
  },
  {
    id: THEME_IDS.FOREST,
    label: "Forest",
    description: "Green-teal surfaces with mint contrast.",
    supportsMode: false,
    colorScheme: "dark"
  }
]);

const CUSTOM_THEME_PALETTES = Object.freeze({
  [THEME_IDS.COBALT]: Object.freeze({
    bgTop: "#081520",
    bgBottom: "#040b11",
    surface: "rgba(11, 21, 32, 0.96)",
    surfaceStrong: "rgba(17, 30, 44, 0.98)",
    line: "rgba(255, 255, 255, 0.08)",
    lineStrong: "rgba(255, 255, 255, 0.16)",
    text: "#edf6ff",
    muted: "#9eb2c5",
    mutedStrong: "#d9ebfb",
    accent: "#59b9ff",
    accentStrong: "#ffd166",
    accentSurface: "rgba(89, 185, 255, 0.14)",
    accentSurfaceStrong: "rgba(89, 185, 255, 0.22)",
    topOverlay: "rgba(255, 209, 102, 0.14)",
    menuGradientStart: "#59b9ff",
    menuGradientEnd: "rgba(4, 11, 17, 0)",
    heroBand: "rgba(12, 35, 54, 0.97)",
    heroBodyTop: "rgba(10, 24, 37, 0.97)",
    heroBodyBottom: "rgba(4, 11, 17, 0.99)",
    heroBorder: "rgba(255, 255, 255, 0.08)",
    danger: "#ff8a73",
    dangerSurface: "rgba(255, 138, 115, 0.12)",
    dangerSurfaceStrong: "rgba(255, 138, 115, 0.22)",
    shadow: "0 24px 52px rgba(0, 0, 0, 0.34)",
    popupShadow: "0 28px 56px rgba(0, 0, 0, 0.42)",
    optionShadow: "0 14px 28px rgba(0, 0, 0, 0.2)",
    tabGroupShadow: "0 24px 48px rgba(0, 0, 0, 0.34)",
    innerShadow: "0 16px 32px rgba(0, 0, 0, 0.2)",
    inputBg: "rgba(255, 255, 255, 0.03)",
    searchInput: "rgba(8, 21, 32, 0.94)",
    codeBg: "rgba(255, 255, 255, 0.06)",
    codeBorder: "rgba(255, 255, 255, 0.08)",
    dropdownSurface: "#11202d",
    dropdownText: "#edf6ff",
    headerBg: "#061018",
    colBg: "rgba(11, 21, 32, 0.8)",
    archivedStripe: "#0e1924",
    archivedStripeStrong: "rgba(255, 255, 255, 0.08)",
    scrollbarTrack: "#08111a",
    scrollbarThumb: "#2a4761",
    focusOutline: "#59b9ff",
    keyBackground: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
    keyBorder: "rgba(255, 255, 255, 0.18)",
    keyBorderBottom: "rgba(255, 255, 255, 0.24)",
    keyColor: "#edf6ff",
    keyBoxShadow: "0 1px 0 rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.04) inset",
    bodyRadial: "rgba(89, 185, 255, 0.18)",
    primaryEnd: "#ffd166",
    primaryText: "#101723",
    successStart: "#59b9ff",
    successEnd: "#8fd7ff",
    successText: "#08131c",
    ambientShadow: "0 12px 24px rgba(89, 185, 255, 0.18)",
    ambientHoverShadow: "0 16px 30px rgba(89, 185, 255, 0.24)",
    primaryShadow: "0 16px 30px rgba(89, 185, 255, 0.24)",
    primaryHoverShadow: "0 18px 34px rgba(89, 185, 255, 0.3)",
    successShadow: "0 16px 30px rgba(143, 215, 255, 0.18)",
    successHoverShadow: "0 18px 34px rgba(143, 215, 255, 0.24)"
  }),
  [THEME_IDS.EMBER]: Object.freeze({
    bgTop: "#1b100b",
    bgBottom: "#090605",
    surface: "rgba(31, 18, 13, 0.96)",
    surfaceStrong: "rgba(40, 22, 15, 0.98)",
    line: "rgba(255, 238, 229, 0.08)",
    lineStrong: "rgba(255, 238, 229, 0.16)",
    text: "#fff4ee",
    muted: "#d1b8ad",
    mutedStrong: "#f2d8ca",
    accent: "#ff8c42",
    accentStrong: "#ffd166",
    accentSurface: "rgba(255, 140, 66, 0.14)",
    accentSurfaceStrong: "rgba(255, 140, 66, 0.22)",
    topOverlay: "rgba(255, 209, 102, 0.12)",
    menuGradientStart: "#ff8c42",
    menuGradientEnd: "rgba(9, 6, 5, 0)",
    heroBand: "rgba(53, 28, 18, 0.97)",
    heroBodyTop: "rgba(35, 20, 14, 0.97)",
    heroBodyBottom: "rgba(9, 6, 5, 0.99)",
    heroBorder: "rgba(255, 238, 229, 0.08)",
    danger: "#ff9c83",
    dangerSurface: "rgba(255, 156, 131, 0.12)",
    dangerSurfaceStrong: "rgba(255, 156, 131, 0.22)",
    shadow: "0 24px 52px rgba(0, 0, 0, 0.36)",
    popupShadow: "0 28px 56px rgba(0, 0, 0, 0.44)",
    optionShadow: "0 14px 28px rgba(0, 0, 0, 0.22)",
    tabGroupShadow: "0 24px 48px rgba(0, 0, 0, 0.36)",
    innerShadow: "0 16px 32px rgba(0, 0, 0, 0.22)",
    inputBg: "rgba(255, 255, 255, 0.03)",
    searchInput: "rgba(31, 18, 13, 0.94)",
    codeBg: "rgba(255, 255, 255, 0.06)",
    codeBorder: "rgba(255, 255, 255, 0.08)",
    dropdownSurface: "#271812",
    dropdownText: "#fff4ee",
    headerBg: "#140d0a",
    colBg: "rgba(31, 18, 13, 0.8)",
    archivedStripe: "#1a110d",
    archivedStripeStrong: "rgba(255, 255, 255, 0.08)",
    scrollbarTrack: "#120b08",
    scrollbarThumb: "#5b3929",
    focusOutline: "#ff8c42",
    keyBackground: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
    keyBorder: "rgba(255, 255, 255, 0.18)",
    keyBorderBottom: "rgba(255, 255, 255, 0.24)",
    keyColor: "#fff4ee",
    keyBoxShadow: "0 1px 0 rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.04) inset",
    bodyRadial: "rgba(255, 140, 66, 0.16)",
    primaryEnd: "#ffd166",
    primaryText: "#221209",
    successStart: "#ff8c42",
    successEnd: "#ffb06f",
    successText: "#231006",
    ambientShadow: "0 12px 24px rgba(255, 140, 66, 0.18)",
    ambientHoverShadow: "0 16px 30px rgba(255, 140, 66, 0.24)",
    primaryShadow: "0 16px 30px rgba(255, 140, 66, 0.22)",
    primaryHoverShadow: "0 18px 34px rgba(255, 140, 66, 0.28)",
    successShadow: "0 16px 30px rgba(255, 176, 111, 0.16)",
    successHoverShadow: "0 18px 34px rgba(255, 176, 111, 0.22)"
  }),
  [THEME_IDS.FOREST]: Object.freeze({
    bgTop: "#071610",
    bgBottom: "#030b08",
    surface: "rgba(8, 27, 22, 0.96)",
    surfaceStrong: "rgba(11, 35, 28, 0.98)",
    line: "rgba(239, 255, 250, 0.08)",
    lineStrong: "rgba(239, 255, 250, 0.16)",
    text: "#edfef8",
    muted: "#a5cfc3",
    mutedStrong: "#dbfff3",
    accent: "#4dd4ac",
    accentStrong: "#ffda79",
    accentSurface: "rgba(77, 212, 172, 0.14)",
    accentSurfaceStrong: "rgba(77, 212, 172, 0.22)",
    topOverlay: "rgba(255, 218, 121, 0.12)",
    menuGradientStart: "#4dd4ac",
    menuGradientEnd: "rgba(3, 11, 8, 0)",
    heroBand: "rgba(13, 38, 31, 0.97)",
    heroBodyTop: "rgba(9, 28, 22, 0.97)",
    heroBodyBottom: "rgba(3, 11, 8, 0.99)",
    heroBorder: "rgba(239, 255, 250, 0.08)",
    danger: "#ff9687",
    dangerSurface: "rgba(255, 150, 135, 0.12)",
    dangerSurfaceStrong: "rgba(255, 150, 135, 0.22)",
    shadow: "0 24px 52px rgba(0, 0, 0, 0.34)",
    popupShadow: "0 28px 56px rgba(0, 0, 0, 0.42)",
    optionShadow: "0 14px 28px rgba(0, 0, 0, 0.2)",
    tabGroupShadow: "0 24px 48px rgba(0, 0, 0, 0.34)",
    innerShadow: "0 16px 32px rgba(0, 0, 0, 0.2)",
    inputBg: "rgba(255, 255, 255, 0.03)",
    searchInput: "rgba(8, 27, 22, 0.94)",
    codeBg: "rgba(255, 255, 255, 0.06)",
    codeBorder: "rgba(255, 255, 255, 0.08)",
    dropdownSurface: "#10261f",
    dropdownText: "#edfef8",
    headerBg: "#05100c",
    colBg: "rgba(8, 27, 22, 0.8)",
    archivedStripe: "#0b1914",
    archivedStripeStrong: "rgba(255, 255, 255, 0.08)",
    scrollbarTrack: "#07110d",
    scrollbarThumb: "#275445",
    focusOutline: "#4dd4ac",
    keyBackground: "linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.04) 100%)",
    keyBorder: "rgba(255, 255, 255, 0.18)",
    keyBorderBottom: "rgba(255, 255, 255, 0.24)",
    keyColor: "#edfef8",
    keyBoxShadow: "0 1px 0 rgba(0, 0, 0, 0.28), 0 0 0 1px rgba(255, 255, 255, 0.04) inset",
    bodyRadial: "rgba(77, 212, 172, 0.18)",
    primaryEnd: "#ffda79",
    primaryText: "#08150f",
    successStart: "#4dd4ac",
    successEnd: "#86f1d2",
    successText: "#04130d",
    ambientShadow: "0 12px 24px rgba(77, 212, 172, 0.18)",
    ambientHoverShadow: "0 16px 30px rgba(77, 212, 172, 0.24)",
    primaryShadow: "0 16px 30px rgba(77, 212, 172, 0.22)",
    primaryHoverShadow: "0 18px 34px rgba(77, 212, 172, 0.28)",
    successShadow: "0 16px 30px rgba(134, 241, 210, 0.16)",
    successHoverShadow: "0 18px 34px rgba(134, 241, 210, 0.22)"
  })
});

const CUSTOM_THEME_VARIABLES = Object.freeze(
  [...new Set(
    Object.values(CUSTOM_THEME_PALETTES)
      .flatMap((palette) => Object.keys(buildCustomThemeCssVariables(palette)))
  )]
);

export function getTheme(themeId) {
  return THEMES.find((theme) => theme.id === themeId) || THEMES[0];
}

export function normalizeTheme(themeId) {
  return getTheme(themeId).id;
}

export function normalizeThemeMode(themeMode) {
  if (themeMode === THEME_MODES.LIGHT || themeMode === THEME_MODES.DARK) {
    return themeMode;
  }

  return THEME_MODES.SYSTEM;
}

export function getEffectiveThemeMode(themeOrSettings = {}) {
  const theme = getTheme(
    typeof themeOrSettings === "object" && themeOrSettings
      ? themeOrSettings.theme
      : themeOrSettings
  );

  // Imported palettes currently ship as a single dark/base treatment until
  // paired light variants are added, so their effective mode stays dark.
  if (!theme.supportsMode) {
    return THEME_MODES.DARK;
  }

  const normalizedThemeMode = normalizeThemeMode(
    typeof themeOrSettings === "object" && themeOrSettings
      ? themeOrSettings.themeMode
      : undefined
  );

  if (normalizedThemeMode !== THEME_MODES.SYSTEM) {
    return normalizedThemeMode;
  }

  if (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return THEME_MODES.LIGHT;
  }

  return THEME_MODES.DARK;
}

export function formatThemeLabel(themeOrSettings = {}, { includeMode = true } = {}) {
  const theme = getTheme(
    typeof themeOrSettings === "object" && themeOrSettings
      ? themeOrSettings.theme
      : themeOrSettings
  );

  if (!includeMode || !theme.supportsMode) {
    return `${theme.label} theme`;
  }

  const normalizedThemeMode = normalizeThemeMode(
    typeof themeOrSettings === "object" && themeOrSettings
      ? themeOrSettings.themeMode
      : undefined
  );

  if (normalizedThemeMode === THEME_MODES.SYSTEM) {
    return `${theme.label} theme (System: ${capitalizeThemeMode(
      getEffectiveThemeMode(themeOrSettings)
    )})`;
  }

  return `${theme.label} theme (${capitalizeThemeMode(normalizedThemeMode)})`;
}

export function applyDocumentTheme(themeOrSettings, themeModeOrRoot, maybeRoot) {
  const {
    root,
    themeId,
    themeMode
  } = resolveThemeArguments(themeOrSettings, themeModeOrRoot, maybeRoot);
  const theme = getTheme(themeId);

  if (!root) {
    return {
      theme: theme.id,
      themeMode
    };
  }

  root.dataset.theme = theme.id;
  clearCustomThemeCssVariables(root);

  if (theme.supportsMode) {
    if (themeMode === THEME_MODES.SYSTEM) {
      root.removeAttribute("data-theme-mode");
      root.style?.removeProperty?.("color-scheme");
    } else {
      root.dataset.themeMode = themeMode;
      root.style.colorScheme = themeMode;
    }
  } else {
    root.removeAttribute("data-theme-mode");
    root.style.colorScheme = theme.colorScheme;
    applyCustomThemeCssVariables(root, buildCustomThemeCssVariables(CUSTOM_THEME_PALETTES[theme.id]));
  }

  return {
    theme: theme.id,
    themeMode
  };
}

function resolveThemeArguments(themeOrSettings, themeModeOrRoot, maybeRoot) {
  // Keep supporting the older mode/root call shape while the repo finishes
  // moving every surface onto the shared { theme, themeMode } settings contract.
  if (isThemeSettings(themeOrSettings)) {
    return {
      root: themeModeOrRoot ?? document.documentElement,
      themeId: normalizeTheme(themeOrSettings.theme),
      themeMode: normalizeThemeMode(themeOrSettings.themeMode)
    };
  }

  if (isRootLike(themeModeOrRoot) && maybeRoot === undefined) {
    return {
      root: themeModeOrRoot,
      themeId: THEME_IDS.GRIFFIN,
      themeMode: normalizeThemeMode(themeOrSettings)
    };
  }

  return {
    root: maybeRoot ?? document.documentElement,
    themeId: normalizeTheme(themeOrSettings),
    themeMode: normalizeThemeMode(themeModeOrRoot)
  };
}

function isThemeSettings(value) {
  return Boolean(value) && typeof value === "object" && ("theme" in value || "themeMode" in value);
}

function isRootLike(value) {
  return Boolean(value) && typeof value === "object" && ("dataset" in value || "style" in value);
}

function capitalizeThemeMode(themeMode) {
  return `${themeMode}`.charAt(0).toUpperCase() + `${themeMode}`.slice(1);
}

function clearCustomThemeCssVariables(root) {
  if (!root?.style?.removeProperty) {
    return;
  }

  for (const variableName of CUSTOM_THEME_VARIABLES) {
    root.style.removeProperty(variableName);
  }
}

function applyCustomThemeCssVariables(root, variables) {
  if (!root?.style?.setProperty) {
    return;
  }

  for (const [variableName, value] of Object.entries(variables)) {
    root.style.setProperty(variableName, value);
  }
}

function buildCustomThemeCssVariables(palette) {
  if (!palette) {
    return {};
  }

  return {
    "--bg": palette.bgBottom,
    "--panel": palette.surface,
    "--panel-strong": palette.surfaceStrong,
    "--line": palette.line,
    "--line-strong": palette.lineStrong,
    "--text": palette.text,
    "--muted": palette.muted,
    "--accent": palette.accent,
    "--accent-strong": palette.accentStrong,
    "--danger": palette.danger,
    "--shadow": palette.shadow,
    "--body-radial": palette.bodyRadial,
    "--body-gradient-start": palette.bgTop,
    "--body-gradient-end": palette.bgBottom,
    "--menu-hover-bg": palette.accentSurface,
    "--selection-pill-bg": palette.accentSurface,
    "--input-bg": palette.inputBg,
    "--focus-outline": palette.focusOutline,
    "--toggle-bg": "rgba(255, 255, 255, 0.03)",
    "--tab-bg": "rgba(255, 255, 255, 0.03)",
    "--tab-selected-border": palette.accentSurfaceStrong,
    "--tab-selected-bg": palette.accentSurface,
    "--badge-bg": palette.codeBg,
    "--dropdown-surface": palette.dropdownSurface,
    "--dropdown-text": palette.dropdownText,
    "--primary-gradient-end": palette.primaryEnd,
    "--primary-text": palette.primaryText,
    "--button-ambient-shadow": palette.ambientShadow,
    "--button-ambient-hover-shadow": palette.ambientHoverShadow,
    "--button-primary-shadow": palette.primaryShadow,
    "--button-primary-hover-shadow": palette.primaryHoverShadow,
    "--gs-bg": palette.bgTop,
    "--gs-surface": palette.surface,
    "--gs-surface-strong": palette.surfaceStrong,
    "--gs-accent": palette.accent,
    "--gs-top-overlay": palette.topOverlay,
    "--gs-menu-gradient-start": palette.menuGradientStart,
    "--gs-menu-gradient-end": palette.menuGradientEnd,
    "--gs-text": palette.text,
    "--gs-muted": palette.muted,
    "--gs-muted-strong": palette.mutedStrong,
    "--gs-line": palette.line,
    "--gs-line-strong": palette.lineStrong,
    "--gs-shadow": palette.shadow,
    "--gs-grid-line": "rgba(255, 255, 255, 0.015)",
    "--hero-band": palette.heroBand,
    "--hero-body-top": palette.heroBodyTop,
    "--hero-body-bottom": palette.heroBodyBottom,
    "--hero-border": palette.heroBorder,
    "--surface-gradient-start": palette.surfaceStrong,
    "--surface-gradient-end": palette.surface,
    "--pill-border": palette.accentSurfaceStrong,
    "--pill-bg": palette.accentSurface,
    "--pill-text": palette.mutedStrong,
    "--option-border": palette.line,
    "--option-bg-start": "rgba(255, 255, 255, 0.045)",
    "--option-bg-end": "rgba(255, 255, 255, 0.02)",
    "--option-hover-border": palette.accentSurfaceStrong,
    "--option-hover-bg-start": "rgba(255, 255, 255, 0.065)",
    "--option-hover-bg-end": "rgba(255, 255, 255, 0.03)",
    "--option-hover-shadow": palette.optionShadow,
    "--option-selected-border": palette.accentSurfaceStrong,
    "--option-selected-bg-start": palette.accentSurface,
    "--option-selected-bg-end": "rgba(255, 255, 255, 0.02)",
    "--input-shadow": "inset 0 1px 0 rgba(255, 255, 255, 0.04)",
    "--ghost-bg": "rgba(255, 255, 255, 0.04)",
    "--ghost-hover-bg": palette.accentSurface,
    "--ghost-hover-border": palette.accentSurfaceStrong,
    "--status-border": palette.accentSurfaceStrong,
    "--status-bg": palette.accentSurface,
    "--code-bg": palette.codeBg,
    "--code-border": palette.codeBorder,
    "--button-primary-start": palette.accent,
    "--button-primary-end": palette.primaryEnd,
    "--button-primary-text": palette.primaryText,
    "--button-primary-shadow": palette.primaryShadow,
    "--button-primary-hover-shadow": palette.primaryHoverShadow,
    "--button-success-start": palette.successStart,
    "--button-success-end": palette.successEnd,
    "--button-success-text": palette.successText,
    "--button-success-shadow": palette.successShadow,
    "--button-success-hover-shadow": palette.successHoverShadow,
    "--link-color": palette.accent,
    "--link-color-background": palette.accentSurface,
    "--text-color": palette.text,
    "--text-color-weak": palette.muted,
    "--text-color-extra-weak": palette.muted,
    "--text-color-em": palette.text,
    "--bg-color": palette.surface,
    "--border-color": palette.line,
    "--button-inner-border-color": palette.lineStrong,
    "--button-inner-border-color-hover": palette.accentSurfaceStrong,
    "--button-hover-background": `linear-gradient(180deg, ${palette.accentSurfaceStrong} 0%, ${palette.accentSurface} 100%)`,
    "--stronger-border-color": palette.lineStrong,
    "--even-stronger-border-color": palette.accentSurfaceStrong,
    "--warning-text-color": palette.danger,
    "--text-highlight-bg-color": palette.accentSurfaceStrong,
    "--shadowPoint35Opacity": "rgba(0, 0, 0, 0.42)",
    "--x-key-border-color": palette.keyBorder,
    "--x-key-border-bottom-color": palette.keyBorderBottom,
    "--x-key-background": palette.keyBackground,
    "--x-key-color": palette.keyColor,
    "--x-key-box-shadow": palette.keyBoxShadow,
    "--x-key-text-shadow": "none",
    "--popup-box-shadow": palette.popupShadow,
    "--header-bg-color": palette.headerBg,
    "--col-bg-color": palette.colBg,
    "--search-input-color": palette.searchInput,
    "--blue-control": palette.accent,
    "--red-control": palette.danger,
    "--control-button-hover-bg-color": palette.accentSurface,
    "--red-control-button-hover-bg-color": palette.dangerSurface,
    "--control-button-hover-bg-color2": palette.accentSurfaceStrong,
    "--control-button-hover-border-color": palette.accentSurfaceStrong,
    "--red-control-button-hover-border-color": palette.dangerSurfaceStrong,
    "--archived-stripe": palette.archivedStripe,
    "--archived-stripe-sml2": palette.archivedStripeStrong,
    "--tab-group-box-shadow": palette.tabGroupShadow,
    "--inner-tab-group-box-shadow": palette.innerShadow,
    "--tab-group-border": `1px solid ${palette.line}`,
    "--tab-group-border-pulse": `1px solid ${palette.accentSurfaceStrong}`,
    "--scrollbar-track-color": palette.scrollbarTrack,
    "--scrollbar-track-thumb-color": palette.scrollbarThumb,
    "--menu-item-inset-color": palette.accentSurfaceStrong,
    "--menu-item-hover-background-color": palette.accentSurface,
    "--focus-outline-color": palette.focusOutline,
    "--flag-hover-bg-color": palette.accentSurface,
    "--red-flag-hover-bg-color": palette.dangerSurface,
    "--tick-cross-box-shadow": "rgba(0, 0, 0, 0.32) -1px 0 0 0",
    "--tick-cross-box-shadow-rtl": "rgba(0, 0, 0, 0.32) 1px 0 0 0",
    "--collector-primary-start": palette.accent,
    "--collector-primary-end": palette.primaryEnd,
    "--collector-primary-text": palette.primaryText,
    "--collector-primary-shadow": palette.primaryShadow,
    "--collector-primary-hover-shadow": palette.primaryHoverShadow,
    "--collector-success-start": palette.successStart,
    "--collector-success-end": palette.successEnd,
    "--collector-success-text": palette.successText,
    "--collector-success-shadow": palette.successShadow,
    "--collector-success-hover-shadow": palette.successHoverShadow,
    "--collector-button-ambient-shadow": palette.ambientShadow,
    "--collector-button-ambient-hover-shadow": palette.ambientHoverShadow,
    "--collector-danger-bg": `linear-gradient(180deg, ${palette.dangerSurface} 0%, rgba(255, 255, 255, 0.02) 100%)`,
    "--collector-danger-border": palette.dangerSurfaceStrong,
    "--collector-danger-shadow": "0 12px 24px rgba(255, 138, 115, 0.16)",
    "--collector-danger-hover-bg": `linear-gradient(180deg, ${palette.dangerSurfaceStrong} 0%, ${palette.dangerSurface} 100%)`,
    "--collector-danger-hover-shadow": "0 16px 30px rgba(255, 138, 115, 0.24)"
  };
}
