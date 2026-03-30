import type { APIRoute } from "astro";
import { getAllDocs } from "../utils/collections";
import { llmsFullTxt, docToFullItem } from "../utils/llms";

const siteUrl = "https://www.chromatic.com";
const baseUrl = import.meta.env.BASE_URL;
const SITE = `${siteUrl}${baseUrl}`;

export const GET: APIRoute = async () => {
  const allDocs = await getAllDocs();

  return llmsFullTxt({
    name: "Chromatic docs",
    description:
      "Chromatic is a cloud-based toolchain for visual testing, reviewing, and documenting Storybook components.",
    site: SITE,
    sections: [],
    docs: allDocs.map((entry) => docToFullItem(entry, SITE)),
  });
};
