import {
  escapeHtml,
  getHostname,
  matchesSearch,
  normalizeUrl
} from "./shared.js";

export const COLLECTOR_EXPORT_FORMATS = Object.freeze({
  HTML: "html",
  JSON: "json",
  CSV: "csv"
});

const EXPORT_APP_NAME = "Tab Collector";
const GRIFFIN_SITE_URL = "https://griffinsoftwarestudios.com";
const GRIFFIN_PRIVACY_URL = "https://griffinsoftwarestudios.com/privacy-policy.html";
const GRIFFIN_TERMS_URL = "https://griffinsoftwarestudios.com/terms-of-use.html";
const GRIFFIN_COPYRIGHT = "Copyright © Griffin Software Studios 2021-2024";
const GRIFFIN_BANNER_LOGO_DATA_URI =
  "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKAAAABaCAMAAAAIGK1gAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAAlQTFRF////AAAA////fu+PTwAAAAN0Uk5T//8A18oNQQAAA6BJREFUeNrsm9Ga4yAIhc/H+z/07s00AgcENZnM7uSupW3+oCIcKeTlF34B/2/AG/Dx9zoGCPRv/nVNzOwD1DoBxBodQ5jYI/MpQNCL2YUSht/GmeliftQhBPaCeQaIBT7/hrVHZvLxI4CJx0DtqHs0B5QdQIkB5ZqLMzPyJVJyoaYxb8G88IC5+RCggABKTiDDqo7NmITpAiByQCiaU4C4APEAoPQB8XrAawW+HhAvBMQPApQfAIhfwAXAAewHAOIVgPC7HN4NKMVA8xCgqSA0IFYAxyKEEBTNGaBc+eR7AXEWEBwQsTkFZKloDTD6ANpm0BozKrc2ACUHlDrgJxUcdpRzgOiaGaArUGVSGswmws4YwxXBvmCVI4CLLgTLUMfhxrR2qgFemkzPDFU6+mxV5i6cA2ofoWWGTw+G2Pd59wDg4iAHgJ+vXBvjDuDGIENvz2ojHlfIbPzmKsAiIcIyCaO4sw24vJLhK00XECdjXAdccSGIoupWc+5CAxjpwIuEIJr0kGxdszBObIqAi7EGRDPXu/IXXfjrHcBs08Us0Vd6p8lXob8ei5VZhrI0yCADrDNNnXORc4Qy4BIh/KGIG6FhWxGS89QBV2INSVjpXBpLLeLyBuDUhcJPmtIbQwJA9AAXBhm8JAFZ1aMubn+vCliJNZqQyhtu0zPu9wJ/C7A1Dbn+YmOagjXP0gNsD3Igv7CV7M9OhjlaBuwShuqLCocMELY4LwI2Y00iD7FCVAXEDcC6C5HxucJTFQIqYjcAKy4c5k6YLMPrK2bv6+7FrTpZyoDDzFPZxC5gTQvJMlHlI7aulwE7UoPVXRBdThJTycUNgFwYQnzZuVcH5Ol/0awAh701asVRO/FTgHDbZBCI7cy8C1AoYJQzj5XAMuCWyq/uLyRN1XW8Oz55AJC0sHiJ33i8EagPAXqh1WwaVrT/lrM6E0SiaCj4bkCErUHBkrwZEKS9i3ZcSRCebvcgCcfae67cexzQRhLSmqaWSzQdbhtik0ME23D0BE8BBvlCXoI8AGgiW9KJmvcK3gXoB3HUzhHXok91v9GEmSjT9oz3SP+gzAHdDUXIuIsP2A91YIbHIETc1x6m4Ix5r4fVP37sQmGRZ94FLFtdwHH5EunMZllJo48abfOo3ieAiDtWyCiV+6r585hOdCPtB+pHoNskpw/VZv2JGel/LGIT+aXuvyEm5o9GvQYo4VFN0iZSNxf/T/KG6xfwnwf8I8AAAf9CaxcC3TMAAAAASUVORK5CYII=";
const GRIFFIN_SOCIAL_LINKS = Object.freeze([
  {
    label: "X",
    href: "https://twitter.com/GriffinSoftStud"
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/GriffinSoftware"
  },
  {
    label: "GitHub",
    href: "https://github.com/Griffin-Software-Studios"
  }
]);
const GRIFFIN_CONTACT_CARDS = Object.freeze([
  {
    label: "Address",
    value: "PO BOX 1095 Saluda NC 28773"
  },
  {
    label: "Email",
    value: "info@griffinsoftwarestudios.com",
    href: "mailto:info@griffinsoftwarestudios.com"
  },
  {
    label: "Phone",
    value: "+1 (843) 284-6776",
    href: "tel:8432846776"
  }
]);

export function getVisibleGroups(groups = [], filter = "") {
  return groups.filter((group) => matchesSearch(group, filter));
}

export function getCollectorSummary(groups = [], filter = "") {
  const visibleGroups = getVisibleGroups(groups, filter);

  return {
    visibleGroups,
    groupCount: visibleGroups.length,
    tabCount: visibleGroups.reduce((total, group) => total + group.tabs.length, 0)
  };
}

export function getRestoreBehavior(settings, modifierState = {}) {
  const {
    ctrlKey = false,
    metaKey = false,
    altKey = false,
    shiftKey = false
  } = modifierState;
  const defaultKeep = settings.restoreBehavior === "keep";
  const defaultArchive = settings.restoreBehavior === "archive";
  const keepTabs = defaultKeep || defaultArchive || ctrlKey || metaKey;
  const archive = defaultArchive || altKey;
  const active = settings.restoreTabFocus === "switch" && !(ctrlKey || metaKey);

  return {
    keepTabs,
    archive,
    active,
    newWindow: shiftKey
  };
}

export function getNextFocusIndex(cardCount, activeIndex, direction) {
  if (cardCount <= 0) {
    return -1;
  }

  if (activeIndex === -1) {
    return direction > 0 ? 0 : cardCount - 1;
  }

  return (activeIndex + direction + cardCount) % cardCount;
}

export function getCollectorFaviconFallback(tab) {
  const host = getHostname(tab.url);
  const source = host || tab.title || "t";
  return source.slice(0, 1).toUpperCase();
}

export function getDuplicateTabPreview(groups = []) {
  const seenUrls = new Map();
  const clustersByKey = new Map();

  for (const group of groups) {
    const sourceTabs = Array.isArray(group?.tabs) ? group.tabs : [];

    for (const tab of sourceTabs) {
      const key = normalizeUrl(tab?.url || "");
      const tabRecord = {
        key,
        groupId: group?.id || "",
        groupTitle: group?.title || "Untitled group",
        tabId: tab?.id || "",
        title: tab?.title || "",
        url: tab?.url || "",
        favIconUrl: tab?.favIconUrl || "",
        addedAt: tab?.addedAt || ""
      };

      if (!seenUrls.has(key)) {
        seenUrls.set(key, tabRecord);
        continue;
      }

      if (!clustersByKey.has(key)) {
        clustersByKey.set(key, {
          key,
          original: seenUrls.get(key),
          duplicates: []
        });
      }

      clustersByKey.get(key).duplicates.push(tabRecord);
    }
  }

  const clusters = [...clustersByKey.values()];

  return {
    clusters,
    duplicateCount: clusters.reduce((total, cluster) => total + cluster.duplicates.length, 0)
  };
}

export function removeSelectedTabsFromGroups(groups = [], selectedTabs = []) {
  const selectedByGroup = new Map();

  for (const selection of selectedTabs) {
    const groupId = selection?.groupId || "";
    const tabId = selection?.tabId || "";

    if (!groupId || !tabId) {
      continue;
    }

    if (!selectedByGroup.has(groupId)) {
      selectedByGroup.set(groupId, new Set());
    }

    selectedByGroup.get(groupId).add(tabId);
  }

  let removedCount = 0;
  let emptiedGroupCount = 0;
  const nextGroups = groups.map((group) => {
    const sourceTabs = Array.isArray(group?.tabs) ? group.tabs : [];
    const selectedTabIds = selectedByGroup.get(group?.id);

    if (!selectedTabIds?.size) {
      return group;
    }

    const nextTabs = sourceTabs.filter((tab) => {
      const shouldRemove = selectedTabIds.has(tab?.id);

      if (shouldRemove) {
        removedCount += 1;
      }

      return !shouldRemove;
    });

    if (!nextTabs.length && sourceTabs.length) {
      emptiedGroupCount += 1;
    }

    return nextTabs.length === sourceTabs.length
      ? group
      : {
          ...group,
          tabs: nextTabs
        };
  });

  return {
    groups: nextGroups,
    removedCount,
    emptiedGroupCount
  };
}

export function removeDuplicateTabsFromGroups(groups = []) {
  const preview = getDuplicateTabPreview(groups);
  const selectedTabs = preview.clusters.flatMap((cluster) =>
    cluster.duplicates.map((tab) => ({
      groupId: tab.groupId,
      tabId: tab.tabId
    }))
  );

  return removeSelectedTabsFromGroups(groups, selectedTabs);
}

export function serializeGroupsAsJson(groups = [], metadata = {}) {
  return JSON.stringify(
    {
      appName: metadata.appName || EXPORT_APP_NAME,
      format: "json",
      exportedAt: metadata.exportedAt || new Date().toISOString(),
      groupCount: groups.length,
      tabCount: countTabs(groups),
      groups
    },
    null,
    2
  );
}

export function serializeGroupsAsCsv(groups = []) {
  const header = [
    "group_title",
    "group_notes",
    "group_archived",
    "group_locked",
    "group_pinned",
    "group_created_at",
    "group_updated_at",
    "tab_title",
    "tab_url",
    "tab_favicon_url",
    "tab_added_at"
  ];
  const rows = [header];

  for (const group of groups) {
    const sharedColumns = [
      group?.title || "",
      group?.notes || "",
      Boolean(group?.archived),
      Boolean(group?.locked),
      Boolean(group?.pinned),
      group?.createdAt || "",
      group?.updatedAt || ""
    ];
    const tabs = Array.isArray(group?.tabs) ? group.tabs : [];

    if (!tabs.length) {
      rows.push([
        ...sharedColumns,
        "",
        "",
        "",
        ""
      ]);
      continue;
    }

    for (const tab of tabs) {
      rows.push([
        ...sharedColumns,
        tab?.title || "",
        tab?.url || "",
        tab?.favIconUrl || "",
        tab?.addedAt || ""
      ]);
    }
  }

  return rows.map((row) => row.map(formatCsvCell).join(",")).join("\n");
}

export function serializeGroupsAsHtml(groups = [], options = {}) {
  const theme = resolveExportThemeTokens(options.themeTokens);
  const exportLabel = escapeHtml(options.title || `${EXPORT_APP_NAME} export`);
  const exportedAt = options.exportedAt || new Date().toISOString();
  const exportedStamp = formatExportDate(exportedAt);
  const themeLabel = escapeHtml(options.themeLabel || "Current theme snapshot");
  const groupCount = groups.length;
  const tabCount = countTabs(groups);
  const summaryLabel = `${groupCount} group${groupCount === 1 ? "" : "s"} · ${tabCount} tab${
    tabCount === 1 ? "" : "s"
  }`;

  return `<!DOCTYPE html>
<html dir="ltr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${exportLabel}</title>
  <style>
    :root {
      --bg-color: ${theme.bgColor};
      --text-color: ${theme.textColor};
      --text-color-weak: ${theme.weakTextColor};
      --text-color-em: ${theme.emphasisTextColor};
      --surface-gradient-start: ${theme.surfaceStart};
      --surface-gradient-end: ${theme.surfaceEnd};
      --hero-border: ${theme.heroBorder};
      --brand-start: ${theme.brandStart};
      --brand-accent: ${theme.brandAccent};
      --brand-muted: ${theme.brandMuted};
      --mark-bg: ${theme.highlightBg};
      --footer-bg: #050505;
      --footer-card-bg: #ffffff;
      --footer-card-text: #1b1b1b;
      --footer-muted: rgba(255, 255, 255, 0.72);
      --shadow: 0 20px 44px rgba(0, 0, 0, 0.18);
      --radius-xl: 28px;
      --radius-lg: 20px;
      --radius-md: 14px;
    }

    * {
      box-sizing: border-box;
    }

    body {
      margin: 0;
      font-family: "Open Sans", "Segoe UI", Arial, sans-serif;
      color: var(--text-color);
      background:
        radial-gradient(circle at top left, rgba(255, 140, 66, 0.14), transparent 34%),
        radial-gradient(circle at top right, rgba(71, 155, 204, 0.18), transparent 38%),
        linear-gradient(180deg, var(--bg-color), var(--bg-color));
      line-height: 1.55;
    }

    a {
      color: var(--brand-start);
    }

    #contentAreaDiv {
      width: min(1120px, calc(100% - 32px));
      margin: 0 auto;
      padding: 28px 0 48px;
    }

    .heroShell {
      position: relative;
      overflow: hidden;
      padding: 28px;
      border-radius: var(--radius-xl);
      background: linear-gradient(180deg, var(--surface-gradient-start), var(--surface-gradient-end));
      border: 1px solid var(--hero-border);
      box-shadow: var(--shadow);
    }

    .heroShell::before {
      content: "";
      position: absolute;
      inset: 0 auto auto 0;
      width: 100%;
      height: 4px;
      background: linear-gradient(90deg, var(--brand-start), var(--brand-accent));
    }

    .heroTop {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 24px;
      flex-wrap: wrap;
    }

    .heroBrand {
      display: flex;
      align-items: center;
      gap: 18px;
      min-width: 0;
    }

    .heroBrand img {
      width: 108px;
      max-width: 100%;
      height: auto;
      display: block;
    }

    .heroCopy {
      min-width: 0;
    }

    .eyebrow {
      margin: 0 0 8px;
      color: var(--brand-muted);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.18em;
      text-transform: uppercase;
    }

    .heroTitle {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(2rem, 4vw, 3.4rem);
      line-height: 0.95;
      color: var(--text-color-em);
    }

    .heroSubtitle {
      margin: 10px 0 0;
      max-width: 720px;
      color: var(--text-color-weak);
      font-size: 15px;
    }

    .heroMeta {
      display: grid;
      gap: 10px;
      min-width: 220px;
      justify-items: end;
    }

    .heroMetaPill {
      padding: 9px 12px;
      border-radius: 999px;
      border: 1px solid var(--hero-border);
      background: rgba(255, 255, 255, 0.06);
      color: var(--text-color-em);
      font-size: 12px;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      text-align: center;
    }

    .heroSummary {
      margin-top: 22px;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .summaryCard {
      padding: 16px;
      border-radius: var(--radius-lg);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid var(--hero-border);
    }

    .summaryCardLabel {
      color: var(--brand-muted);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .summaryCardValue {
      margin-top: 8px;
      font-size: clamp(1.1rem, 2.1vw, 1.45rem);
      font-weight: 700;
      color: var(--text-color-em);
      overflow-wrap: anywhere;
    }

    #tabGroupsDiv {
      margin-top: 22px;
      display: grid;
      gap: 18px;
    }

    .tabGroup {
      overflow: hidden;
      border-radius: var(--radius-lg);
      background: linear-gradient(180deg, var(--surface-gradient-start), var(--surface-gradient-end));
      border: 1px solid var(--hero-border);
      box-shadow: var(--shadow);
    }

    .tabGroupHeader {
      padding: 20px 22px 16px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }

    .tabGroupHeaderRow {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .tabGroupTitleText {
      min-width: 0;
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: clamp(1.55rem, 2.5vw, 2.1rem);
      line-height: 1.02;
      color: var(--text-color-em);
      overflow-wrap: anywhere;
    }

    .tabCountInline,
    .flagPill {
      display: inline-flex;
      align-items: center;
      min-height: 28px;
      padding: 0 10px;
      border-radius: 999px;
      border: 1px solid rgba(71, 155, 204, 0.22);
      background: rgba(71, 155, 204, 0.12);
      color: var(--brand-muted);
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.11em;
      text-transform: uppercase;
    }

    .createdDate {
      margin-top: 12px;
      color: var(--text-color-weak);
      font-size: 12px;
    }

    .flagRow {
      margin-top: 14px;
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }

    .groupNotes {
      margin-top: 14px;
      padding: 14px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.08);
      color: var(--text-color);
      white-space: pre-wrap;
      overflow-wrap: anywhere;
    }

    .tabList {
      display: grid;
      gap: 10px;
      padding: 16px 18px 18px;
    }

    .tab {
      padding: 14px 16px;
      border-radius: var(--radius-md);
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.07);
    }

    .tabHeader {
      display: flex;
      align-items: center;
      gap: 12px;
      justify-content: space-between;
      flex-wrap: wrap;
    }

    .tabLink {
      color: var(--brand-start);
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      overflow-wrap: anywhere;
    }

    .tabLink:hover {
      text-decoration: underline;
    }

    .tabMeta {
      color: var(--text-color-weak);
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.1em;
    }

    .tabUrl {
      margin-top: 6px;
      color: var(--text-color-weak);
      font-size: 13px;
      overflow-wrap: anywhere;
    }

    .emptyTabState {
      padding: 20px 18px;
      color: var(--text-color-weak);
      font-size: 14px;
    }

    .footerShell {
      margin-top: 26px;
      overflow: hidden;
      border-radius: var(--radius-xl);
      background: var(--footer-bg);
      color: #ffffff;
      box-shadow: var(--shadow);
    }

    .footerTop {
      padding: 24px 24px 18px;
      display: grid;
      gap: 20px;
    }

    .footerBrandRow {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 16px;
      flex-wrap: wrap;
    }

    .footerBrand {
      display: flex;
      align-items: center;
      gap: 16px;
    }

    .footerBrand img {
      width: 132px;
      max-width: 100%;
      height: auto;
      display: block;
    }

    .footerBrandTitle {
      margin: 0;
      font-family: Georgia, "Times New Roman", serif;
      font-size: 1.45rem;
      color: #ffffff;
    }

    .footerBrandCopy {
      margin: 8px 0 0;
      color: var(--footer-muted);
      max-width: 560px;
    }

    .footerLegal {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    .footerLink,
    .socialLink {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-height: 38px;
      padding: 0 14px;
      border-radius: 999px;
      border: 1px solid rgba(255, 255, 255, 0.12);
      color: #ffffff;
      text-decoration: none;
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.04em;
    }

    .footerLink:hover,
    .socialLink:hover {
      border-color: var(--brand-accent);
      color: #ffffff;
    }

    .footerCards {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 12px;
    }

    .footerCard {
      padding: 18px;
      border-radius: var(--radius-lg);
      background: var(--footer-card-bg);
      color: var(--footer-card-text);
    }

    .footerCardLabel {
      color: #6f6f6f;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.16em;
      text-transform: uppercase;
    }

    .footerCardValue,
    .footerCardValue a {
      margin-top: 10px;
      color: #cb8b2d;
      font-size: 15px;
      font-weight: 700;
      text-decoration: none;
      overflow-wrap: anywhere;
    }

    .footerBottom {
      padding: 0 24px 24px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 14px;
      flex-wrap: wrap;
      color: var(--footer-muted);
      font-size: 13px;
    }

    .footerSocial {
      display: flex;
      gap: 10px;
      flex-wrap: wrap;
    }

    @media (max-width: 860px) {
      #contentAreaDiv {
        width: min(100%, calc(100% - 20px));
        padding-top: 18px;
        padding-bottom: 28px;
      }

      .heroShell,
      .footerTop,
      .footerBottom {
        padding-left: 18px;
        padding-right: 18px;
      }

      .heroSummary,
      .footerCards {
        grid-template-columns: 1fr;
      }

      .heroMeta {
        justify-items: start;
      }
    }
  </style>
</head>
<body>
  <div id="contentAreaDiv">
    <section class="heroShell">
      <div class="heroTop">
        <div class="heroBrand">
          <img src="${GRIFFIN_BANNER_LOGO_DATA_URI}" alt="Griffin Software Studios logo">
          <div class="heroCopy">
            <p class="eyebrow">${escapeHtml(EXPORT_APP_NAME)} export</p>
            <h1 class="heroTitle">${exportLabel}</h1>
            <p class="heroSubtitle">Saved tabs exported from ${escapeHtml(
              EXPORT_APP_NAME
            )} with the current collector theme applied and Griffin Software Studios branding embedded for direct sharing.</p>
          </div>
        </div>
        <div class="heroMeta">
          <div class="heroMetaPill">${escapeHtml(summaryLabel)}</div>
          <div class="heroMetaPill">${themeLabel}</div>
        </div>
      </div>
      <div class="heroSummary">
        <div class="summaryCard">
          <div class="summaryCardLabel">Exported</div>
          <div class="summaryCardValue">${escapeHtml(exportedStamp)}</div>
        </div>
        <div class="summaryCard">
          <div class="summaryCardLabel">Groups</div>
          <div class="summaryCardValue">${groupCount}</div>
        </div>
        <div class="summaryCard">
          <div class="summaryCardLabel">Tabs</div>
          <div class="summaryCardValue">${tabCount}</div>
        </div>
      </div>
    </section>

    <div id="tabGroupsDiv">
      ${groups.map((group) => buildHtmlExportGroup(group)).join("")}
    </div>

    <footer class="footerShell">
      <div class="footerTop">
        <div class="footerBrandRow">
          <div class="footerBrand">
            <img src="${GRIFFIN_BANNER_LOGO_DATA_URI}" alt="Griffin Software Studios logo">
            <div>
              <h2 class="footerBrandTitle">Griffin Software Studios</h2>
              <p class="footerBrandCopy">Custom software, digital media, and secure delivery. Visit griffinsoftwarestudios.com for platform details, governance pages, and company updates.</p>
            </div>
          </div>
          <div class="footerLegal">
            <a class="footerLink" href="${GRIFFIN_SITE_URL}">Website</a>
            <a class="footerLink" href="${GRIFFIN_PRIVACY_URL}">Privacy Policy</a>
            <a class="footerLink" href="${GRIFFIN_TERMS_URL}">Terms of Use</a>
          </div>
        </div>
        <div class="footerCards">
          ${GRIFFIN_CONTACT_CARDS.map((card) => buildFooterCard(card)).join("")}
        </div>
      </div>
      <div class="footerBottom">
        <div>${escapeHtml(GRIFFIN_COPYRIGHT)}</div>
        <div class="footerSocial">
          ${GRIFFIN_SOCIAL_LINKS.map(
            (link) =>
              `<a class="socialLink" href="${link.href}">${escapeHtml(link.label)}</a>`
          ).join("")}
        </div>
      </div>
    </footer>
  </div>
</body>
</html>`;
}

function countTabs(groups = []) {
  return groups.reduce((total, group) => total + (Array.isArray(group?.tabs) ? group.tabs.length : 0), 0);
}

function formatCsvCell(value) {
  const text = String(value ?? "");
  return `"${text.replaceAll("\"", "\"\"")}"`;
}

function formatExportDate(value) {
  const parsed = Date.parse(value);

  if (Number.isNaN(parsed)) {
    return String(value || "");
  }

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(parsed));
}

function resolveExportThemeTokens(themeTokens = {}) {
  return {
    bgColor: themeTokens.bgColor || "#101723",
    textColor: themeTokens.textColor || "#ecf2fb",
    weakTextColor: themeTokens.weakTextColor || "#9daec5",
    emphasisTextColor: themeTokens.emphasisTextColor || "#ffffff",
    surfaceStart: themeTokens.surfaceStart || "rgba(20, 29, 45, 0.96)",
    surfaceEnd: themeTokens.surfaceEnd || "rgba(12, 18, 28, 0.98)",
    heroBorder: themeTokens.heroBorder || "rgba(255, 255, 255, 0.08)",
    brandStart: themeTokens.brandStart || "#479bcc",
    brandAccent: themeTokens.brandAccent || "#ff8c42",
    brandMuted: themeTokens.brandMuted || "#bccddd",
    highlightBg: themeTokens.highlightBg || "rgba(255, 140, 66, 0.3)"
  };
}

function buildHtmlExportGroup(group) {
  const tabs = Array.isArray(group?.tabs) ? group.tabs : [];
  const flagMarkup = [
    group?.archived ? "Archived" : "",
    group?.locked ? "Locked" : "",
    group?.pinned ? "Pinned" : ""
  ]
    .filter(Boolean)
    .map((label) => `<span class="flagPill">${escapeHtml(label)}</span>`)
    .join("");
  const updatedAt = group?.updatedAt || group?.createdAt || "";
  const createdAt = group?.createdAt || "";
  const timestampParts = [
    updatedAt ? `Updated ${formatExportDate(updatedAt)}` : "",
    createdAt ? `Created ${formatExportDate(createdAt)}` : ""
  ].filter(Boolean);

  return `
    <section class="tabGroup">
      <div class="tabGroupHeader">
        <div class="tabGroupHeaderRow">
          <div class="tabGroupTitleText">${escapeHtml(group?.title || "Saved tabs")}</div>
          <div class="tabCountInline">${tabs.length} tab${tabs.length === 1 ? "" : "s"}</div>
        </div>
        <div class="createdDate">${escapeHtml(timestampParts.join(" · "))}</div>
        ${flagMarkup ? `<div class="flagRow">${flagMarkup}</div>` : ""}
        ${
          group?.notes
            ? `<div class="groupNotes">${escapeHtml(group.notes).replaceAll("\n", "<br>")}</div>`
            : ""
        }
      </div>
      <div class="tabList">
        ${
          tabs.length
            ? tabs.map((tab) => buildHtmlExportTab(tab)).join("")
            : '<div class="emptyTabState">No tabs remain in this group.</div>'
        }
      </div>
    </section>
  `;
}

function buildHtmlExportTab(tab) {
  const url = tab?.url || "";
  const title = tab?.title || url || "Untitled tab";
  const host = getHostname(url);
  const addedAt = tab?.addedAt ? formatExportDate(tab.addedAt) : "";
  const metaParts = [host, addedAt].filter(Boolean);

  return `
    <div class="tab">
      <div class="tabHeader">
        <a class="tabLink" href="${escapeHtml(url)}">${escapeHtml(title)}</a>
        ${metaParts.length ? `<div class="tabMeta">${escapeHtml(metaParts.join(" · "))}</div>` : ""}
      </div>
      ${url ? `<div class="tabUrl">${escapeHtml(url)}</div>` : ""}
    </div>
  `;
}

function buildFooterCard(card) {
  const valueMarkup = card.href
    ? `<a href="${card.href}">${escapeHtml(card.value)}</a>`
    : escapeHtml(card.value);

  return `
    <div class="footerCard">
      <div class="footerCardLabel">${escapeHtml(card.label)}</div>
      <div class="footerCardValue">${valueMarkup}</div>
    </div>
  `;
}
