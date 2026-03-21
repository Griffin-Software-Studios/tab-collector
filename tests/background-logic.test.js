import test from "node:test";
import assert from "node:assert/strict";

import { setChromeMock } from "./test-helpers.js";

setChromeMock();

const backgroundLogic = await import("../background-logic.js");

test("isGroupSaveAvailable reflects whether an active tab is inside a group", () => {
  assert.equal(backgroundLogic.isGroupSaveAvailable({ groupId: 2 }), true);
  assert.equal(backgroundLogic.isGroupSaveAvailable({ groupId: -1 }), false);
  assert.equal(backgroundLogic.isGroupSaveAvailable(null), false);
});

test("selectTabsForWindowSave prefers multi-selection over group or full-window saves", () => {
  const tabs = [
    { id: 1, index: 3, highlighted: true, active: false, groupId: -1 },
    { id: 2, index: 1, highlighted: false, active: true, groupId: 44 },
    { id: 3, index: 2, highlighted: true, active: false, groupId: 44 },
    { id: 4, index: 0, highlighted: false, active: false, groupId: -1 }
  ];

  const selected = backgroundLogic.selectTabsForWindowSave(tabs);

  assert.deepEqual(
    selected.map((tab) => tab.id),
    [3, 1]
  );
});

test("selectTabsForWindowSave falls back to the active browser tab group when there is no multi-selection", () => {
  const tabs = [
    { id: 1, index: 3, highlighted: false, active: true, groupId: 44 },
    { id: 2, index: 1, highlighted: false, active: false, groupId: 44 },
    { id: 3, index: 2, highlighted: false, active: false, groupId: 44 },
    { id: 4, index: 0, highlighted: false, active: false, groupId: -1 }
  ];

  const selected = backgroundLogic.selectTabsForWindowSave(tabs);

  assert.deepEqual(
    selected.map((tab) => tab.id),
    [2, 3, 1]
  );
});

test("selectTabsForWindowSave returns the full window when there is no multi-selection or active group", () => {
  const tabs = [
    { id: 1, index: 3, highlighted: false, active: false, groupId: -1 },
    { id: 2, index: 1, highlighted: false, active: true, groupId: -1 },
    { id: 3, index: 2, highlighted: false, active: false, groupId: -1 }
  ];

  const selected = backgroundLogic.selectTabsForWindowSave(tabs);

  assert.deepEqual(
    selected.map((tab) => tab.id),
    [2, 3, 1]
  );
});

test("prepareTabsForSave filters restricted, collector, excluded, pinned, and duplicate tabs", () => {
  const tabs = [
    { id: 1, index: 0, url: "https://www.example.com/a", pinned: false },
    { id: 2, index: 1, url: "edge://settings", pinned: false },
    { id: 3, index: 2, url: "chrome-extension://tab-collector/collector.html", pinned: false },
    { id: 4, index: 3, url: "https://blocked.example.com/a", pinned: false },
    { id: 5, index: 4, url: "https://www.example.com/a#hash", pinned: false },
    { id: 6, index: 5, url: "https://pinned.example.com", pinned: true }
  ];
  const groups = [
    {
      id: "existing",
      tabs: [{ url: "https://www.example.com/a" }]
    }
  ];

  const prepared = backgroundLogic.prepareTabsForSave(tabs, {
    groups,
    excludedDomains: ["blocked.example.com"],
    includePinnedTabs: false,
    allowDuplicateTabs: false,
    isExcludedUrl(url, excludedDomains) {
      return excludedDomains.includes(new URL(url).hostname.replace(/^www\./i, ""));
    }
  });

  assert.deepEqual(prepared.eligibleTabs, []);
  assert.equal(prepared.skippedCount, 6);
});

test("prepareTabsForSave keeps matching tabs when duplicates and pinned tabs are allowed", () => {
  const tabs = [
    { id: 1, index: 2, url: "https://www.example.com/a#hash", pinned: false },
    { id: 2, index: 1, url: "https://pinned.example.com", pinned: true }
  ];

  const prepared = backgroundLogic.prepareTabsForSave(tabs, {
    groups: [],
    excludedDomains: [],
    includePinnedTabs: true,
    allowDuplicateTabs: true,
    isExcludedUrl() {
      return false;
    }
  });

  assert.deepEqual(
    prepared.eligibleTabs.map((tab) => tab.id),
    [2, 1]
  );
  assert.equal(prepared.skippedCount, 0);
});

test("buildNextGroupsAfterSave appends into an existing destination group without mutating the original array", () => {
  const groups = [
    {
      id: "dest",
      title: "Existing",
      updatedAt: "2026-03-14T12:00:00.000Z",
      tabs: [{ id: "existing-tab", title: "Existing", url: "https://existing.example.com" }]
    }
  ];
  const tabs = [
    { id: 1, title: "Inbox", url: "https://mail.example.com" }
  ];

  const result = backgroundLogic.buildNextGroupsAfterSave(groups, tabs, {
    destinationGroupId: "dest",
    title: "",
    makeGroup() {
      throw new Error("makeGroup should not be used when destination exists");
    },
    makeTabRecord(tab) {
      return { id: `saved-${tab.id}`, title: tab.title, url: tab.url };
    },
    updateGroupTimestamp(group) {
      group.updatedAt = "updated";
      return group;
    }
  });

  assert.equal(result.groupId, "dest");
  assert.equal(result.groups[0].tabs[0].id, "saved-1");
  assert.equal(result.groups[0].updatedAt, "updated");
  assert.equal(groups[0].tabs.length, 1);
});

test("buildNextGroupsAfterSave creates a new group when no destination group is provided", () => {
  const groups = [
    { id: "older", title: "Older", tabs: [] }
  ];
  const tabs = [
    { id: 1, title: "Inbox", url: "https://mail.example.com" }
  ];

  const result = backgroundLogic.buildNextGroupsAfterSave(groups, tabs, {
    destinationGroupId: undefined,
    title: "Custom",
    makeGroup(inputTabs, title) {
      return {
        id: "new-group",
        title,
        tabs: inputTabs
      };
    },
    makeTabRecord(tab) {
      return tab;
    },
    updateGroupTimestamp(group) {
      return group;
    }
  });

  assert.equal(result.groupId, "new-group");
  assert.deepEqual(
    result.groups.map((group) => group.id),
    ["new-group", "older"]
  );
});

test("buildGroupPinMutationPlan matches open tabs by normalized URL and creates only missing tabs when pinning", () => {
  const groupTabs = [
    { url: "https://example.com/a#section" },
    { url: "https://missing.example.com/" },
    { url: "https://example.com/b" }
  ];
  const openTabs = [
    { id: 9, index: 4, url: "https://other.example.com", pinned: false },
    { id: 3, index: 2, url: "https://example.com/b", pinned: false },
    { id: 1, index: 0, url: "https://example.com/a", pinned: false }
  ];

  const plan = backgroundLogic.buildGroupPinMutationPlan(groupTabs, openTabs, {
    pinned: true
  });

  assert.deepEqual(
    plan.tabsToUpdate.map((tab) => tab.id),
    [1, 3]
  );
  assert.deepEqual(
    plan.tabsToCreate.map((tab) => tab.url),
    ["https://missing.example.com/"]
  );
  assert.deepEqual(plan.tabsToRemove, []);
});

test("buildGroupPinMutationPlan removes matching pinned tabs and ignores non-pinned matches when unpinning", () => {
  const groupTabs = [
    { url: "https://example.com/a#section" },
    { url: "https://missing.example.com/" }
  ];
  const openTabs = [
    { id: 1, index: 0, url: "https://example.com/a", pinned: true },
    { id: 2, index: 1, url: "https://missing.example.com/", pinned: false },
    { id: 3, index: 2, url: "https://unrelated.example.com", pinned: true }
  ];

  const plan = backgroundLogic.buildGroupPinMutationPlan(groupTabs, openTabs, {
    pinned: false
  });

  assert.deepEqual(plan.tabsToUpdate, []);
  assert.deepEqual(plan.tabsToCreate, []);
  assert.deepEqual(
    plan.tabsToRemove.map((tab) => tab.id),
    [1]
  );
});

test("buildGroupPinMutationPlan keeps group-tab order when matching tabs to pin", () => {
  const groupTabs = [
    { url: "https://example.com/third" },
    { url: "https://example.com/first" },
    { url: "https://example.com/second" }
  ];
  const openTabs = [
    { id: 1, index: 0, url: "https://example.com/first", pinned: false },
    { id: 2, index: 1, url: "https://example.com/second", pinned: false },
    { id: 3, index: 2, url: "https://example.com/third", pinned: false }
  ];

  const plan = backgroundLogic.buildGroupPinMutationPlan(groupTabs, openTabs, {
    pinned: true
  });

  assert.deepEqual(
    plan.tabsToUpdate.map((tab) => tab.id),
    [3, 1, 2]
  );
  assert.deepEqual(plan.tabsToCreate, []);
  assert.deepEqual(plan.tabsToRemove, []);
});

test("buildGroupPinMutationPlan removes one pinned browser tab per duplicate group URL on unpin", () => {
  const groupTabs = [
    { url: "https://example.com/dup#one" },
    { url: "https://example.com/dup#two" },
    { url: "https://example.com/unique" }
  ];
  const openTabs = [
    { id: 11, index: 0, url: "https://example.com/dup", pinned: true },
    { id: 12, index: 1, url: "https://example.com/dup", pinned: true },
    { id: 13, index: 2, url: "https://example.com/dup", pinned: false },
    { id: 14, index: 3, url: "https://example.com/unique", pinned: true }
  ];

  const plan = backgroundLogic.buildGroupPinMutationPlan(groupTabs, openTabs, {
    pinned: false
  });

  assert.deepEqual(
    plan.tabsToRemove.map((tab) => tab.id),
    [11, 12, 14]
  );
  assert.deepEqual(plan.tabsToUpdate, []);
  assert.deepEqual(plan.tabsToCreate, []);
});
