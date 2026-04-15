import { getAllCollections } from "../../utils/collections";
import { transformNavGroups, flattenGroups } from "./transform-nav-groups";

const {
  overview,
  visualTests,
  accessibilityTests,
  interactionTests,
  playwright,
  cypress,
  vitest,
  configuration,
  modes,
  snapshot,
  turbosnap,
  collaborate,
  ci,
  account,
  guides,
  troubleshooting,
} = await getAllCollections();

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
    title: "Vitest",
    items: vitest,
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
