import type { APIRoute } from "astro";
import { getAllDocs } from "../utils/collections";
import { llmsFullTxt, docToFullItem } from "../utils/llms";

export const GET: APIRoute = async ({ site, url }) => {
  const baseUrl = import.meta.env.BASE_URL;
  const SITE = new URL(baseUrl, site ?? url).href.replace(/\/$/, "");

  const allDocs = await getAllDocs();

  return llmsFullTxt({
    name: "Chromatic docs",
    description:
      "Chromatic is a cloud-based toolchain for visual testing, reviewing, and documenting Storybook components.",
    site: SITE,
    docs: allDocs.map((entry) => docToFullItem(entry, SITE)),
  });
};
