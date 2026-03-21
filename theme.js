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
    supportsMode: true,
    colorScheme: "light dark"
  },
  {
    id: THEME_IDS.EMBER,
    label: "Ember",
    description: "Warm copper highlights on a graphite base.",
    supportsMode: true,
    colorScheme: "light dark"
  },
  {
    id: THEME_IDS.FOREST,
    label: "Forest",
    description: "Green-teal surfaces with mint contrast.",
    supportsMode: true,
    colorScheme: "light dark"
  }
]);

const CUSTOM_THEME_DARK_PALETTES = Object.freeze({
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

const CUSTOM_THEME_LIGHT_OVERRIDES = Object.freeze({
  [THEME_IDS.COBALT]: Object.freeze({
    bgTop: "#f3f8ff",
    bgBottom: "#e4eef9",
    surface: "rgba(255, 255, 255, 0.94)",
    surfaceStrong: "rgba(249, 253, 255, 0.98)",
    line: "rgba(13, 29, 45, 0.12)",
    lineStrong: "rgba(13, 29, 45, 0.2)",
    text: "#102235",
    muted: "#496179",
    mutedStrong: "#2d4a67",
    accentSurface: "rgba(89, 185, 255, 0.18)",
    accentSurfaceStrong: "rgba(89, 185, 255, 0.28)",
    menuGradientEnd: "rgba(228, 238, 249, 0)",
    heroBand: "rgba(228, 238, 249, 0.96)",
    heroBodyTop: "rgba(240, 247, 255, 0.98)",
    heroBodyBottom: "rgba(225, 237, 250, 0.98)",
    heroBorder: "rgba(13, 29, 45, 0.12)",
    shadow: "0 18px 40px rgba(10, 33, 54, 0.12)",
    popupShadow: "0 22px 48px rgba(10, 33, 54, 0.14)",
    optionShadow: "0 10px 22px rgba(10, 33, 54, 0.1)",
    tabGroupShadow: "0 18px 36px rgba(10, 33, 54, 0.12)",
    innerShadow: "0 12px 24px rgba(10, 33, 54, 0.08)",
    inputBg: "rgba(255, 255, 255, 0.85)",
    searchInput: "rgba(255, 255, 255, 0.95)",
    codeBg: "rgba(11, 31, 48, 0.06)",
    codeBorder: "rgba(11, 31, 48, 0.14)",
    dropdownSurface: "#f1f7ff",
    dropdownText: "#102235",
    headerBg: "#e7f0fb",
    colBg: "rgba(244, 250, 255, 0.92)",
    archivedStripe: "#dde9f7",
    archivedStripeStrong: "rgba(16, 34, 53, 0.16)",
    scrollbarTrack: "#dce8f5",
    scrollbarThumb: "#8aa4bf",
    keyColor: "#102235",
    keyBoxShadow: "0 1px 0 rgba(16, 34, 53, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5) inset",
    bodyRadial: "rgba(89, 185, 255, 0.1)",
    primaryText: "#0e1f31",
    successText: "#0d2435",
    ambientShadow: "0 10px 20px rgba(89, 185, 255, 0.14)",
    ambientHoverShadow: "0 12px 24px rgba(89, 185, 255, 0.2)",
    primaryShadow: "0 12px 24px rgba(89, 185, 255, 0.2)",
    primaryHoverShadow: "0 14px 28px rgba(89, 185, 255, 0.26)",
    successShadow: "0 12px 24px rgba(143, 215, 255, 0.16)",
    successHoverShadow: "0 14px 28px rgba(143, 215, 255, 0.22)"
  }),
  [THEME_IDS.EMBER]: Object.freeze({
    bgTop: "#fff6f1",
    bgBottom: "#f8ece5",
    surface: "rgba(255, 253, 251, 0.95)",
    surfaceStrong: "rgba(255, 248, 242, 0.98)",
    line: "rgba(59, 31, 21, 0.12)",
    lineStrong: "rgba(59, 31, 21, 0.2)",
    text: "#31190f",
    muted: "#7f5445",
    mutedStrong: "#5f392b",
    accentSurface: "rgba(255, 140, 66, 0.16)",
    accentSurfaceStrong: "rgba(255, 140, 66, 0.26)",
    menuGradientEnd: "rgba(248, 236, 229, 0)",
    heroBand: "rgba(249, 233, 222, 0.96)",
    heroBodyTop: "rgba(255, 244, 236, 0.98)",
    heroBodyBottom: "rgba(249, 233, 222, 0.98)",
    heroBorder: "rgba(59, 31, 21, 0.12)",
    shadow: "0 18px 40px rgba(49, 25, 15, 0.14)",
    popupShadow: "0 22px 48px rgba(49, 25, 15, 0.16)",
    optionShadow: "0 10px 22px rgba(49, 25, 15, 0.1)",
    tabGroupShadow: "0 18px 36px rgba(49, 25, 15, 0.14)",
    innerShadow: "0 12px 24px rgba(49, 25, 15, 0.08)",
    inputBg: "rgba(255, 255, 255, 0.88)",
    searchInput: "rgba(255, 255, 255, 0.95)",
    codeBg: "rgba(65, 32, 18, 0.06)",
    codeBorder: "rgba(65, 32, 18, 0.14)",
    dropdownSurface: "#fff3ea",
    dropdownText: "#31190f",
    headerBg: "#f7e8de",
    colBg: "rgba(255, 246, 239, 0.92)",
    archivedStripe: "#f1dfd1",
    archivedStripeStrong: "rgba(49, 25, 15, 0.16)",
    scrollbarTrack: "#eddccd",
    scrollbarThumb: "#b38770",
    keyColor: "#31190f",
    keyBoxShadow: "0 1px 0 rgba(49, 25, 15, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5) inset",
    bodyRadial: "rgba(255, 140, 66, 0.1)",
    primaryText: "#341807",
    successText: "#3a1704",
    ambientShadow: "0 10px 20px rgba(255, 140, 66, 0.14)",
    ambientHoverShadow: "0 12px 24px rgba(255, 140, 66, 0.2)",
    primaryShadow: "0 12px 24px rgba(255, 140, 66, 0.2)",
    primaryHoverShadow: "0 14px 28px rgba(255, 140, 66, 0.26)",
    successShadow: "0 12px 24px rgba(255, 176, 111, 0.16)",
    successHoverShadow: "0 14px 28px rgba(255, 176, 111, 0.22)"
  }),
  [THEME_IDS.FOREST]: Object.freeze({
    bgTop: "#effaf5",
    bgBottom: "#e0f1e8",
    surface: "rgba(251, 255, 253, 0.95)",
    surfaceStrong: "rgba(244, 253, 248, 0.98)",
    line: "rgba(13, 48, 39, 0.12)",
    lineStrong: "rgba(13, 48, 39, 0.2)",
    text: "#0f2f25",
    muted: "#4f7a6e",
    mutedStrong: "#2e5f52",
    accentSurface: "rgba(77, 212, 172, 0.16)",
    accentSurfaceStrong: "rgba(77, 212, 172, 0.26)",
    menuGradientEnd: "rgba(224, 241, 232, 0)",
    heroBand: "rgba(224, 241, 232, 0.96)",
    heroBodyTop: "rgba(241, 252, 246, 0.98)",
    heroBodyBottom: "rgba(223, 241, 231, 0.98)",
    heroBorder: "rgba(13, 48, 39, 0.12)",
    shadow: "0 18px 40px rgba(10, 44, 35, 0.12)",
    popupShadow: "0 22px 48px rgba(10, 44, 35, 0.14)",
    optionShadow: "0 10px 22px rgba(10, 44, 35, 0.1)",
    tabGroupShadow: "0 18px 36px rgba(10, 44, 35, 0.12)",
    innerShadow: "0 12px 24px rgba(10, 44, 35, 0.08)",
    inputBg: "rgba(255, 255, 255, 0.88)",
    searchInput: "rgba(255, 255, 255, 0.95)",
    codeBg: "rgba(11, 48, 36, 0.06)",
    codeBorder: "rgba(11, 48, 36, 0.14)",
    dropdownSurface: "#effaf4",
    dropdownText: "#0f2f25",
    headerBg: "#e3f2e9",
    colBg: "rgba(242, 253, 247, 0.92)",
    archivedStripe: "#d9ece1",
    archivedStripeStrong: "rgba(15, 47, 37, 0.16)",
    scrollbarTrack: "#d8ebe0",
    scrollbarThumb: "#7ca99b",
    keyColor: "#0f2f25",
    keyBoxShadow: "0 1px 0 rgba(15, 47, 37, 0.12), 0 0 0 1px rgba(255, 255, 255, 0.5) inset",
    bodyRadial: "rgba(77, 212, 172, 0.1)",
    primaryText: "#0a241c",
    successText: "#072118",
    ambientShadow: "0 10px 20px rgba(77, 212, 172, 0.14)",
    ambientHoverShadow: "0 12px 24px rgba(77, 212, 172, 0.2)",
    primaryShadow: "0 12px 24px rgba(77, 212, 172, 0.2)",
    primaryHoverShadow: "0 14px 28px rgba(77, 212, 172, 0.26)",
    successShadow: "0 12px 24px rgba(134, 241, 210, 0.16)",
    successHoverShadow: "0 14px 28px rgba(134, 241, 210, 0.22)"
  })
});

function getCustomThemePalette(themeId, themeMode) {
  const darkPalette = CUSTOM_THEME_DARK_PALETTES[themeId];

  if (!darkPalette) {
    return null;
  }

  if (themeMode !== THEME_MODES.LIGHT) {
    return darkPalette;
  }

  return {
    ...darkPalette,
    ...(CUSTOM_THEME_LIGHT_OVERRIDES[themeId] || {})
  };
}

const CUSTOM_THEME_VARIABLES = Object.freeze(
  [...new Set(
    [THEME_IDS.COBALT, THEME_IDS.EMBER, THEME_IDS.FOREST]
      .flatMap((themeId) => [THEME_MODES.DARK, THEME_MODES.LIGHT].map((themeMode) =>
        Object.keys(buildCustomThemeCssVariables(getCustomThemePalette(themeId, themeMode)))
      ))
      .flat()
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

  if (!includeMode) {
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

  if (theme.id === THEME_IDS.GRIFFIN) {
    if (themeMode === THEME_MODES.SYSTEM) {
      root.removeAttribute("data-theme-mode");
      root.style?.removeProperty?.("color-scheme");
    } else {
      root.dataset.themeMode = themeMode;
      root.style.colorScheme = themeMode;
    }
  } else {
    const effectiveThemeMode = getEffectiveThemeMode({
      theme: theme.id,
      themeMode
    });
    root.dataset.themeMode = effectiveThemeMode;
    root.style.colorScheme = effectiveThemeMode;
    applyCustomThemeCssVariables(
      root,
      buildCustomThemeCssVariables(getCustomThemePalette(theme.id, effectiveThemeMode))
    );
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
