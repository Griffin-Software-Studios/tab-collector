import {
  isCollectorUrl,
  isRestrictedUrl,
  normalizeUrl
} from "./shared.js";

function compareTabIndex(left, right) {
  return (left?.index ?? 0) - (right?.index ?? 0);
}

export function isGroupSaveAvailable(activeTab) {
  return Boolean(activeTab && activeTab.groupId >= 0);
}

export function selectTabsForWindowSave(tabs = []) {
  const sortedTabs = [...tabs].sort(compareTabIndex);
  const highlightedTabs = sortedTabs.filter((tab) => tab.highlighted);

  if (highlightedTabs.length > 1) {
    return highlightedTabs;
  }

  const activeTab = sortedTabs.find((tab) => tab.active);

  if (activeTab?.groupId >= 0) {
    const groupedTabs = sortedTabs.filter((tab) => tab.groupId === activeTab.groupId);

    if (groupedTabs.length) {
      return groupedTabs;
    }
  }

  return sortedTabs;
}

export function prepareTabsForSave(
  tabs,
  {
    groups = [],
    excludedDomains = [],
    includePinnedTabs = false,
    allowDuplicateTabs = true,
    isExcludedUrl
  } = {}
) {
  const existingUrls = new Set(
    groups.flatMap((group) => group.tabs.map((tab) => normalizeUrl(tab.url)))
  );
  const seenUrls = new Set();
  const eligibleTabs = [...tabs]
    .filter((tab) => tab && typeof tab.id === "number")
    .filter((tab) => !isRestrictedUrl(tab.url || ""))
    .filter((tab) => !isCollectorUrl(tab.url || ""))
    .filter((tab) => includePinnedTabs || !tab.pinned)
    .filter((tab) => !isExcludedUrl(tab.url || "", excludedDomains))
    .filter((tab) => {
      if (allowDuplicateTabs) {
        return true;
      }

      const key = normalizeUrl(tab.url || "");

      if (existingUrls.has(key) || seenUrls.has(key)) {
        return false;
      }

      seenUrls.add(key);
      return true;
    })
    .sort(compareTabIndex);

  return {
    eligibleTabs,
    skippedCount: Math.max(0, tabs.length - eligibleTabs.length)
  };
}

export function buildNextGroupsAfterSave(
  groups,
  eligibleTabs,
  { destinationGroupId, title, makeGroup, makeTabRecord, updateGroupTimestamp }
) {
  if (destinationGroupId) {
    const destinationIndex = groups.findIndex((group) => group.id === destinationGroupId);

    if (destinationIndex !== -1) {
      const destinationGroup = {
        ...groups[destinationIndex],
        tabs: [...groups[destinationIndex].tabs]
      };
      destinationGroup.tabs.unshift(...eligibleTabs.map(makeTabRecord));
      updateGroupTimestamp(destinationGroup);

      const nextGroups = [...groups];
      nextGroups[destinationIndex] = destinationGroup;

      return {
        groups: nextGroups,
        groupId: destinationGroup.id
      };
    }
  }

  const newGroup = makeGroup(eligibleTabs, title);

  return {
    groups: [newGroup, ...groups],
    groupId: newGroup.id
  };
}

export function buildGroupPinMutationPlan(groupTabs = [], openTabs = [], { pinned = true } = {}) {
  const openTabsByUrl = new Map();

  for (const tab of [...openTabs].sort(compareTabIndex)) {
    if (!pinned && !tab?.pinned) {
      continue;
    }

    const key = normalizeUrl(tab?.url || "");

    if (!key) {
      continue;
    }

    if (!openTabsByUrl.has(key)) {
      openTabsByUrl.set(key, []);
    }

    openTabsByUrl.get(key).push(tab);
  }

  const tabsToUpdate = [];
  const tabsToCreate = [];
  const tabsToRemove = [];

  for (const groupTab of groupTabs) {
    const key = normalizeUrl(groupTab?.url || "");

    if (!key) {
      continue;
    }

    const matches = openTabsByUrl.get(key);

    if (matches?.length) {
      const match = matches.shift();

      if (pinned) {
        tabsToUpdate.push(match);
      } else {
        tabsToRemove.push(match);
      }

      continue;
    }

    if (pinned) {
      tabsToCreate.push(groupTab);
    }
  }

  return {
    tabsToUpdate,
    tabsToCreate,
    tabsToRemove
  };
}
