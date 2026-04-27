import { getCollection } from "astro:content";
import type { DocEntry } from "./llms";

export async function getAllCollections() {
  const [
    overview,
    visualTests,
    accessibilityTests,
    interactionTests,
    playwright,
    cypress,
    reactNative,
    configuration,
    modes,
    snapshot,
    turbosnap,
    collaborate,
    ci,
    account,
    guides,
    troubleshooting,
    notInNavigation,
  ] = await Promise.all([
    getCollection("overview"),
    getCollection("visualTests"),
    getCollection("accessibilityTests"),
    getCollection("interactionTests"),
    getCollection("playwright"),
    getCollection("cypress"),
    getCollection("reactNative"),
    getCollection("configuration"),
    getCollection("modes"),
    getCollection("snapshot"),
    getCollection("turbosnap"),
    getCollection("collaborate"),
    getCollection("ci"),
    getCollection("account"),
    getCollection("guides"),
    getCollection("troubleshooting"),
    getCollection("notInNavigation"),
  ]);

  return {
    overview,
    visualTests,
    accessibilityTests,
    interactionTests,
    playwright,
    cypress,
    reactNative,
    configuration,
    modes,
    snapshot,
    turbosnap,
    collaborate,
    ci,
    account,
    guides,
    troubleshooting,
    notInNavigation,
  };
}

/**
 * Returns all docs flattened into a single array.
 * Excludes FAQ sub-pages from troubleshooting.
 * Set `includeNotInNavigation` to true to include hidden pages.
 */
export async function getAllDocs({ includeNotInNavigation = false } = {}) {
  const collections = await getAllCollections();

  return Object.entries(collections).flatMap(([key, entries]) => {
    if (key === "notInNavigation") {
      return includeNotInNavigation ? entries : [];
    }
    if (key === "troubleshooting") {
      return entries.filter(({ id }) => id !== "faq" && !id.startsWith("faq/"));
    }
    return entries;
  });
}

/**
 * Maps collection names to section titles for the llms.txt index.
 * Collections mapped to the same title are merged into one section.
 * Order here determines section order in the output.
 */
const sectionMap: [string, string][] = [
  ["overview", "Overview"],
  ["visualTests", "Visual Tests"],
  ["modes", "Visual Tests"],
  ["turbosnap", "Visual Tests"],
  ["accessibilityTests", "Accessibility Tests"],
  ["interactionTests", "Interaction Tests"],
  ["ci", "CI"],
  ["configuration", "Configuration"],
  ["snapshot", "Snapshot"],
  ["guides", "Guides"],
  ["collaborate", "Collaborate"],
  ["playwright", "Playwright"],
  ["cypress", "Cypress"],
  ["reactNative", "React Native"],
  ["account", "Account"],
  ["troubleshooting", "Troubleshooting"],
];

/**
 * Returns all docs grouped into sections for the llms.txt index.
 * Section titles and order are defined by `sectionMap`.
 * New collections added to `getAllCollections` will appear
 * automatically under an auto-generated section title.
 */
export async function getDocSections() {
  const collections = await getAllCollections();

  // Track section order based on first appearance in sectionMap
  const sectionOrder: string[] = [];
  const sectionItems: Record<string, DocEntry[]> = {};

  for (const [collectionName, sectionTitle] of sectionMap) {
    if (!sectionOrder.includes(sectionTitle)) {
      sectionOrder.push(sectionTitle);
      sectionItems[sectionTitle] = [];
    }
  }

  for (const [key, entries] of Object.entries(collections)) {
    if (key === "notInNavigation") continue;

    const filtered =
      key === "troubleshooting"
        ? entries.filter(({ id }) => id !== "faq" && !id.startsWith("faq/"))
        : entries;

    const mapping = sectionMap.find(([name]) => name === key);
    const sectionTitle = mapping ? mapping[1] : key;

    if (!sectionOrder.includes(sectionTitle)) {
      sectionOrder.push(sectionTitle);
      sectionItems[sectionTitle] = [];
    }

    sectionItems[sectionTitle].push(...filtered);
  }

  return sectionOrder
    .filter((title) => sectionItems[title].length > 0)
    .map((title) => ({
      title,
      items: sectionItems[title],
    }));
}
