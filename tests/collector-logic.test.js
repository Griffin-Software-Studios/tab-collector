import test from "node:test";
import assert from "node:assert/strict";

const collectorLogic = await import("../collector-logic.js");

test("getCollectorSummary returns only groups matching the current filter", () => {
  const groups = [
    {
      id: "docs",
      title: "Docs",
      notes: "Internal docs",
      tabs: [{ title: "Guide", url: "https://docs.example.com/start" }]
    },
    {
      id: "ops",
      title: "Ops Queue",
      notes: "",
      tabs: [
        { title: "Alerts", url: "https://alerts.example.com" },
        { title: "Dashboard", url: "https://ops.example.com" }
      ]
    }
  ];

  const summary = collectorLogic.getCollectorSummary(groups, "docs");

  assert.equal(summary.groupCount, 1);
  assert.equal(summary.tabCount, 1);
  assert.deepEqual(
    summary.visibleGroups.map((group) => group.id),
    ["docs"]
  );
});

test("getRestoreBehavior resolves keep/archive/active/newWindow from settings and modifiers", () => {
  const keepBehavior = collectorLogic.getRestoreBehavior(
    {
      restoreBehavior: "keep",
      restoreTabFocus: "stay"
    },
    {
      altKey: true,
      shiftKey: true
    }
  );

  assert.deepEqual(keepBehavior, {
    keepTabs: true,
    archive: true,
    active: false,
    newWindow: true
  });

  const switchBehavior = collectorLogic.getRestoreBehavior(
    {
      restoreBehavior: "remove",
      restoreTabFocus: "switch"
    },
    {
      ctrlKey: false,
      metaKey: false,
      altKey: false,
      shiftKey: false
    }
  );

  assert.deepEqual(switchBehavior, {
    keepTabs: false,
    archive: false,
    active: true,
    newWindow: false
  });

  const archiveBehavior = collectorLogic.getRestoreBehavior(
    {
      restoreBehavior: "archive",
      restoreTabFocus: "switch"
    },
    {
      ctrlKey: true,
      metaKey: false
    }
  );

  assert.deepEqual(archiveBehavior, {
    keepTabs: true,
    archive: true,
    active: false,
    newWindow: false
  });
});

test("getNextFocusIndex cycles through group cards in either direction", () => {
  assert.equal(collectorLogic.getNextFocusIndex(3, -1, 1), 0);
  assert.equal(collectorLogic.getNextFocusIndex(3, -1, -1), 2);
  assert.equal(collectorLogic.getNextFocusIndex(3, 2, 1), 0);
  assert.equal(collectorLogic.getNextFocusIndex(3, 0, -1), 2);
  assert.equal(collectorLogic.getNextFocusIndex(0, -1, 1), -1);
});

test("getCollectorFaviconFallback prefers host initials before title text", () => {
  assert.equal(
    collectorLogic.getCollectorFaviconFallback({
      title: "Inbox",
      url: "https://mail.example.com/inbox"
    }),
    "M"
  );
  assert.equal(
    collectorLogic.getCollectorFaviconFallback({
      title: "Inbox",
      url: ""
    }),
    "I"
  );
});

test("removeDuplicateTabsFromGroups keeps the first normalized URL and removes later matches", () => {
  const groups = [
    {
      id: "alpha",
      title: "Alpha",
      tabs: [
        { id: "a-1", title: "Start", url: "https://example.com/docs#intro" },
        { id: "a-2", title: "Guide", url: "https://example.com/guide" }
      ]
    },
    {
      id: "beta",
      title: "Beta",
      tabs: [
        { id: "b-1", title: "Intro dup", url: "https://example.com/docs#install" },
        { id: "b-2", title: "Guide dup", url: "https://example.com/guide" },
        { id: "b-3", title: "Unique", url: "https://example.com/unique" }
      ]
    }
  ];

  const result = collectorLogic.removeDuplicateTabsFromGroups(groups);

  assert.equal(result.removedCount, 2);
  assert.equal(result.emptiedGroupCount, 0);
  assert.deepEqual(
    result.groups.map((group) => group.tabs.map((tab) => tab.id)),
    [
      ["a-1", "a-2"],
      ["b-3"]
    ]
  );
});

test("getDuplicateTabPreview reports duplicate clusters while preserving the first tab", () => {
  const groups = [
    {
      id: "alpha",
      title: "Alpha",
      tabs: [
        { id: "a-1", title: "Start", url: "https://example.com/docs#intro" },
        { id: "a-2", title: "Guide", url: "https://example.com/guide" }
      ]
    },
    {
      id: "beta",
      title: "Beta",
      tabs: [
        { id: "b-1", title: "Intro dup", url: "https://example.com/docs#install" },
        { id: "b-2", title: "Guide dup", url: "https://example.com/guide" }
      ]
    }
  ];

  const preview = collectorLogic.getDuplicateTabPreview(groups);

  assert.equal(preview.duplicateCount, 2);
  assert.equal(preview.clusters.length, 2);
  assert.deepEqual(
    preview.clusters.map((cluster) => ({
      original: cluster.original.tabId,
      duplicates: cluster.duplicates.map((tab) => tab.tabId)
    })),
    [
      {
        original: "a-1",
        duplicates: ["b-1"]
      },
      {
        original: "a-2",
        duplicates: ["b-2"]
      }
    ]
  );
});

test("removeSelectedTabsFromGroups removes only the selected duplicates", () => {
  const groups = [
    {
      id: "alpha",
      title: "Alpha",
      tabs: [
        { id: "a-1", title: "Start", url: "https://example.com/docs#intro" },
        { id: "a-2", title: "Guide", url: "https://example.com/guide" }
      ]
    },
    {
      id: "beta",
      title: "Beta",
      tabs: [
        { id: "b-1", title: "Intro dup", url: "https://example.com/docs#install" },
        { id: "b-2", title: "Guide dup", url: "https://example.com/guide" },
        { id: "b-3", title: "Unique", url: "https://example.com/unique" }
      ]
    }
  ];

  const result = collectorLogic.removeSelectedTabsFromGroups(groups, [
    { groupId: "beta", tabId: "b-2" }
  ]);

  assert.equal(result.removedCount, 1);
  assert.equal(result.emptiedGroupCount, 0);
  assert.deepEqual(
    result.groups.map((group) => group.tabs.map((tab) => tab.id)),
    [
      ["a-1", "a-2"],
      ["b-1", "b-3"]
    ]
  );
});

test("serializeGroupsAsJson emits importable metadata and group payloads", () => {
  const groups = [
    {
      id: "alpha",
      title: "Alpha",
      tabs: [{ id: "tab-1", title: "Docs", url: "https://example.com/docs" }]
    }
  ];

  const payload = JSON.parse(
    collectorLogic.serializeGroupsAsJson(groups, {
      exportedAt: "2026-03-14T13:00:00.000Z"
    })
  );

  assert.equal(payload.appName, "Tab Collector");
  assert.equal(payload.format, "json");
  assert.equal(payload.groupCount, 1);
  assert.equal(payload.tabCount, 1);
  assert.equal(payload.groups[0].title, "Alpha");
});

test("serializeGroupsAsCsv emits comma-delimited rows for group and tab data", () => {
  const groups = [
    {
      id: "alpha",
      title: "Alpha, Team",
      notes: "Line one",
      archived: false,
      locked: true,
      pinned: false,
      createdAt: "2026-03-14T13:00:00.000Z",
      updatedAt: "2026-03-14T14:00:00.000Z",
      tabs: [
        {
          id: "tab-1",
          title: "Docs",
          url: "https://example.com/docs",
          favIconUrl: "https://example.com/favicon.ico",
          addedAt: "2026-03-14T13:30:00.000Z"
        }
      ]
    }
  ];

  const csv = collectorLogic.serializeGroupsAsCsv(groups);

  assert.match(csv, /^"group_title","group_notes","group_archived"/);
  assert.match(csv, /"Alpha, Team","Line one","false","true","false"/);
  assert.match(csv, /"Docs","https:\/\/example\.com\/docs","https:\/\/example\.com\/favicon\.ico"/);
});

test("serializeGroupsAsHtml includes Griffin branding, legal links, and themed export classes", () => {
  const html = collectorLogic.serializeGroupsAsHtml(
    [
      {
        id: "alpha",
        title: "Alpha",
        notes: "Keep this handy",
        createdAt: "2026-03-14T13:00:00.000Z",
        updatedAt: "2026-03-14T14:00:00.000Z",
        tabs: [{ id: "tab-1", title: "Docs", url: "https://example.com/docs" }]
      }
    ],
    {
      title: "Team export",
      themeLabel: "Dark theme",
      exportedAt: "2026-03-14T15:00:00.000Z",
      themeTokens: {
        bgColor: "#101723",
        brandAccent: "#ff8c42"
      }
    }
  );

  assert.match(html, /Griffin Software Studios/);
  assert.match(html, /privacy-policy\.html/);
  assert.match(html, /terms-of-use\.html/);
  assert.match(html, /twitter\.com\/GriffinSoftStud/);
  assert.match(html, /facebook\.com\/GriffinSoftware/);
  assert.match(html, /github\.com\/Griffin-Software-Studios/);
  assert.match(html, /data:image\/png;base64,/);
  assert.match(html, /class="tabGroup"/);
  assert.match(html, /class="tabLink"/);
  assert.match(html, /Dark theme/);
});
