import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { llmsTxt, docToLlmsItem } from "../utils/llms";

const SITE = "https://chromatic.com/docs";
const LLMS_BASE = `${SITE}/llms`;

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

  const sections = [
    { title: "Overview", items: overview },
    { title: "Visual Tests", items: [...visualTests, ...modes, ...turbosnap] },
    { title: "Accessibility Tests", items: accessibilityTests },
    { title: "Interaction Tests", items: interactionTests },
    { title: "CI", items: ci },
    { title: "Configuration", items: configuration },
    { title: "Snapshot", items: snapshot },
    { title: "Guides", items: guides },
    { title: "Collaborate", items: collaborate },
    { title: "Playwright", items: playwright },
    { title: "Cypress", items: cypress },
    { title: "Account", items: account },
    { title: "Troubleshooting", items: troubleshooting },
  ];

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
