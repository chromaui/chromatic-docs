import type { APIRoute } from "astro";
import { getAllCollections } from "../utils/collections";
import { llmsFullTxt, docToFullItem } from "../utils/llms";

const SITE = "https://chromatic.com/docs";

export const GET: APIRoute = async () => {
  const collections = await getAllCollections();

  const allDocs = [
    ...collections.overview,
    ...collections.visualTests,
    ...collections.accessibilityTests,
    ...collections.interactionTests,
    ...collections.playwright,
    ...collections.cypress,
    ...collections.configuration,
    ...collections.modes,
    ...collections.snapshot,
    ...collections.turbosnap,
    ...collections.collaborate,
    ...collections.ci,
    ...collections.account,
    ...collections.guides,
    ...collections.troubleshooting.filter(
      ({ id }) => id !== "faq" && !id.startsWith("faq/"),
    ),
  ];

  return llmsFullTxt({
    name: "Chromatic docs",
    description:
      "Chromatic is a cloud-based toolchain for visual testing, reviewing, and documenting Storybook components.",
    site: SITE,
    sections: [],
    docs: allDocs.map((entry) => docToFullItem(entry, SITE)),
  });
};
