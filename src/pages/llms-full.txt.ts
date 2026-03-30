import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { llmsFullTxt, docToFullItem } from "../utils/llms";

const SITE = "https://chromatic.com/docs";

export const GET: APIRoute = async () => {
  const overview = await getCollection("overview");
  const visualTests = await getCollection("visualTests");
  const accessibilityTests = await getCollection("accessibilityTests");
  const interactionTests = await getCollection("interactionTests");
  const playwright = await getCollection("playwright");
  const cypress = await getCollection("cypress");
  const configuration = await getCollection("configuration");
  const modes = await getCollection("modes");
  const snapshot = await getCollection("snapshot");
  const turbosnap = await getCollection("turbosnap");
  const collaborate = await getCollection("collaborate");
  const ci = await getCollection("ci");
  const account = await getCollection("account");
  const guides = await getCollection("guides");
  const troubleshooting = await getCollection("troubleshooting", ({ id }) => {
    return id !== "faq" && !id.startsWith("faq/");
  });

  const allDocs = [
    ...overview,
    ...visualTests,
    ...accessibilityTests,
    ...interactionTests,
    ...playwright,
    ...cypress,
    ...configuration,
    ...modes,
    ...snapshot,
    ...turbosnap,
    ...collaborate,
    ...ci,
    ...account,
    ...guides,
    ...troubleshooting,
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
