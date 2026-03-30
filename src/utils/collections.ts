import { getCollection } from "astro:content";

export async function getAllCollections() {
  const [
    overview,
    visualTests,
    accessibilityTests,
    interactionTests,
    playwright,
    cypress,
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
export async function getAllDocs({
  includeNotInNavigation = false,
} = {}) {
  const collections = await getAllCollections();

  return Object.entries(collections).flatMap(([key, entries]) => {
    if (key === "notInNavigation") {
      return includeNotInNavigation ? entries : [];
    }
    if (key === "troubleshooting") {
      return entries.filter(
        ({ id }) => id !== "faq" && !id.startsWith("faq/"),
      );
    }
    return entries;
  });
}
