import type { APIRoute } from "astro";
import { getDocSections } from "../utils/collections";
import { llmsTxt, docToLlmsItem } from "../utils/llms";

export const GET: APIRoute = async ({ site, url }) => {
  const baseUrl = import.meta.env.BASE_URL;
  const base = new URL(baseUrl, site ?? url).href.replace(/\/$/, "");
  const LLMS_BASE = `${base}/llms`;

  const sections = await getDocSections();

  return llmsTxt({
    name: "Chromatic docs",
    description:
      "Chromatic is a cloud-based toolchain for visual testing, reviewing, and documenting Storybook components.",
    sections: sections.map((s) => ({
      title: s.title,
      items: s.items.map((item) => docToLlmsItem(item, LLMS_BASE)),
    })),
  });
};
