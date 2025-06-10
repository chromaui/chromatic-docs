import { getCollection } from "astro:content";
import { transformNavGroups, flattenGroups } from "./transform-nav-groups";

const overview = await getCollection("overview");
const visualTests = await getCollection("visualTests");
const storybook = await getCollection("storybook");
const playwright = await getCollection("playwright");
const cypress = await getCollection("cypress");
const configuration = await getCollection("configuration");
const modes = await getCollection("modes");
const snapshot = await getCollection("snapshot");
const turbosnap = await getCollection("turbosnap");
const collaborate = await getCollection("collaborate");
const plugins = await getCollection("plugins");
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
    title: "Storybook",
    items: storybook,
    defaultOpen: false,
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
    title: "Guides",
    items: guides,
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
    title: "Collaborate",
    items: collaborate,
  },
  {
    title: "CI",
    items: ci,
  },
  {
    title: "Plugins",
    items: plugins,
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
