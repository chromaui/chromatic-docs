import type { APIRoute } from "astro";
import { getAllCollections } from "../utils/collections";
import { llmsFullTxt, docToFullItem } from "../utils/llms";

const siteUrl = "https://www.chromatic.com";
const baseUrl = import.meta.env.BASE_URL;
const SITE = `${siteUrl}${baseUrl}`;

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
