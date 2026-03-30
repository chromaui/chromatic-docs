import type { APIRoute } from "astro";
import { getAllCollections } from "../utils/collections";
import { llmsTxt, docToLlmsItem } from "../utils/llms";

const siteUrl = "https://www.chromatic.com";
const baseUrl = import.meta.env.BASE_URL;
const SITE = `${siteUrl}${baseUrl}`;
const LLMS_BASE = `${SITE}/llms`;

export const GET: APIRoute = async () => {
  const collections = await getAllCollections();

  const troubleshooting = collections.troubleshooting.filter(
    ({ id }) => id !== "faq" && !id.startsWith("faq/"),
  );

  const sections = [
    { title: "Overview", items: collections.overview },
    {
      title: "Visual Tests",
      items: [
        ...collections.visualTests,
        ...collections.modes,
        ...collections.turbosnap,
      ],
    },
    { title: "Accessibility Tests", items: collections.accessibilityTests },
    { title: "Interaction Tests", items: collections.interactionTests },
    { title: "CI", items: collections.ci },
    { title: "Configuration", items: collections.configuration },
    { title: "Snapshot", items: collections.snapshot },
    { title: "Guides", items: collections.guides },
    { title: "Collaborate", items: collections.collaborate },
    { title: "Playwright", items: collections.playwright },
    { title: "Cypress", items: collections.cypress },
    { title: "Account", items: collections.account },
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
