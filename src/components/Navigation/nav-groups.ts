import { getCollection } from "astro:content";
import { transformNavGroups, flattenGroups } from "./transform-nav-groups";

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
const troubleshooting = await getCollection("troubleshooting");

const rawNavGroups = [
  {
    title: "Overview",
    items: overview,
    defaultOpen: true,
    timeline: true,
  },
  {
    title: "Visual Tests",
    items: [
      {
        title: "Modes",
        items: modes,
      },
      {
        title: "TurboSnap",
        items: turbosnap,
      },
      ...visualTests,
    ],
    defaultOpen: false,
  },
  {
    title: "Accessibility Tests",
    items: accessibilityTests,
    defaultOpen: false,
  },
  {
    title: "Interaction Tests",
    items: interactionTests,
    defaultOpen: false,
  },
  {
    title: "CI",
    items: ci,
  },
  {
    title: "Configuration",
    items: configuration,
  },
  {
    title: "Snapshot",
    items: snapshot,
  },
  {
    title: "Guides",
    items: guides,
  },
  {
    title: "Collaborate",
    items: collaborate,
  },
  {
    title: "Playwright",
    items: playwright,
  },
  {
    title: "Cypress",
    items: cypress,
  },
  {
    title: "Account",
    items: account,
  },
  {
    title: "Troubleshooting",
    items: troubleshooting,
  },
];

export const navGroups = transformNavGroups(rawNavGroups);
export const flattenedNavItems = flattenGroups(navGroups);
