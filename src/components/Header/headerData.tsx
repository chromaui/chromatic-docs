import {
  CollectiveIcon,
  color,
  CypressIcon,
  EzCaterIcon,
  FigmaIcon,
  MondayIcon,
  NetlifyIcon,
  PlaywrightIcon,
} from "@chromatic-com/tetra";
import type { HeaderProps, Icons } from "@chromatic-com/tetra";
import React from "react";

interface LinksProps {
  [key: string]: {
    title: string;
    icon?: Icons; // Replace by iconProps when tetra is updated
    iconColor?: keyof typeof color;
    customIcon?: React.ReactNode;
    href: string;
  };
}

const links: LinksProps = {
  UITest: {
    title: "UI Tests",
    icon: "contrast",
    iconColor: "cyan500",
    href: "/features/test",
  },
  VisualTest: {
    title: "Visual test",
    icon: "eye",
    iconColor: "purple500",
    href: "/features/visual-test",
  },
  interactionTest: {
    title: "Interaction test",
    icon: "pointerhand",
    iconColor: "orange500",
    href: "/features/interaction-test",
  },
  storybook: {
    title: "Storybook",
    icon: "storybook",
    iconColor: "pink500",
    href: "/storybook",
  },
  playwright: {
    title: "Playwright",
    customIcon: <PlaywrightIcon />,
    iconColor: "green500",
    href: "/playwright",
  },
  cypress: {
    title: "Cypress",
    customIcon: <CypressIcon />,
    iconColor: "green500",
    href: "/cypress",
  },
  turboSnap: {
    title: "TurboSnap",
    icon: "dashboard",
    iconColor: "blue500",
    href: "/features/turbosnap",
  },
  UIReview: {
    title: "UI Review",
    icon: "batchaccept",
    iconColor: "green500",
    href: "/features/review",
  },
  Publish: {
    title: "Publish",
    icon: "document",
    iconColor: "pink500",
    href: "/features/publish",
  },
  figmaPlugin: {
    title: "Figma plugin",
    customIcon: <FigmaIcon />,
    href: "/features/figma-plugin",
  },
  frontendTeams: {
    title: "Frontend teams",
    icon: "browser",
    iconColor: "orange500",
    href: "/solutions/frontend",
  },
  designSystems: {
    title: "Design systems",
    icon: "grow",
    iconColor: "purple500",
    href: "/solutions/design-systems",
  },
  digitalAgencies: {
    title: "Digital agencies",
    icon: "component",
    iconColor: "blue500",
    href: "/solutions/agencies",
  },
  aboutChromatic: {
    title: "About Chromatic",
    icon: "chromatic",
    iconColor: "orange500",
    href: "/company/about",
  },
  careers: {
    title: "Careers",
    icon: "user",
    iconColor: "purple500",
    href: "/company/careers",
  },
  security: {
    title: "Security",
    icon: "lock",
    iconColor: "green500",
    href: "/security",
  },
  netlify: {
    title: "Netlify",
    customIcon: <NetlifyIcon />,
    href: "/customers/netlify",
  },
  monday: {
    title: "monday.com",
    customIcon: <MondayIcon />,
    href: "/customers/monday",
  },
  collective: {
    title: "Collective.work",
    customIcon: <CollectiveIcon />,
    href: "/customers/collective",
  },
  ezcater: {
    title: "ezCater",
    customIcon: <EzCaterIcon />,
    href: "/customers/ezcater",
  },
};

export const desktopData: HeaderProps["desktopData"] = [
  {
    id: "features",
    name: "Features",
    leftPosition: -120,
    menu: [
      {
        content: [
          {
            type: "separator",
            title: "Test",
          },
          {
            ...links.UITest,
            type: "link",
            description: "Test how UIs look & function",
          },
          {
            ...links.VisualTest,
            type: "link",
            description:
              "Pinpoint bugs down to the browser, viewport, and pixel",
          },
          {
            ...links.interactionTest,
            type: "link",
            description: "Verify behavior of all screens and components",
          },
          {
            ...links.turboSnap,
            type: "link",
            description:
              "Track changed components to only test what's necessary",
          },
        ],
        backgroundColor: "white",
      },
      {
        content: [
          {
            type: "separator",
            title: "Review",
          },
          {
            ...links.UIReview,
            type: "link",
            description: "Speed up team sign-off and manage change requests",
          },
          {
            ...links.Publish,
            type: "link",
            description: "Index & version components to reuse existing work",
          },
          {
            ...links.figmaPlugin,
            type: "link",
            description: "Embed your stories right next to designs in Figma",
          },
        ],
        backgroundColor: "white",
      },
      {
        content: [
          {
            type: "separator",
            title: "Integrations",
          },
          {
            ...links.storybook,
            type: "link",
            description: "Run visual tests directly inside Storybook",
          },
          {
            ...links.playwright,
            type: "link",
            description:
              "Visual tests for every page in your Playwright E2E suite",
          },
          {
            ...links.cypress,
            type: "link",
            description:
              "Visual tests for every page in your Cypress E2E suite",
          },
        ],
        backgroundColor: "white",
      },
    ],
  },
  {
    id: "pricing",
    name: "Pricing",
    href: "/pricing",
  },
  {
    id: "customers",
    name: "Customers",
    leftPosition: -120,
    menu: [
      {
        content: [
          {
            type: "separator",
            title: "Use cases",
          },
          {
            ...links.frontendTeams,
            type: "link",
            description: "Boost efficiency by streamlining review and QA",
          },
          {
            ...links.designSystems,
            type: "link",
            description: "Ensure UI consistency and quality every commit",
          },
          {
            ...links.digitalAgencies,
            type: "link",
            description: "Increase margins by speeding up client sign-off",
          },
        ],
      },
      {
        content: [
          {
            type: "separator",
            title: "Customer Stories",
          },
          {
            ...links.netlify,
            type: "link",
            description: "How Netlify rebranded in six weeks without bugs",
          },
          {
            ...links.monday,
            type: "link",
            description: "How 200 developers speed up their frontend velocity",
          },
          {
            ...links.collective,
            type: "link",
            description:
              "How to deliver personalized UX across borders & devices",
          },
          {
            ...links.ezcater,
            type: "link",
            description:
              "How to simultaneously test UI appearance & functionality",
          },
        ],
        backgroundColor: "white",
      },
    ],
  },
  {
    id: "docs",
    name: "Docs",
    href: "/docs",
  },
  {
    id: "blog",
    name: "Blog",
    href: "/blog",
  },
  {
    id: "company",
    name: "Company",
    leftPosition: -20,
    menu: [
      {
        content: [
          {
            ...links.aboutChromatic,
            type: "link",
            description: "Our mission is to improve the UX of the internet",
          },
          {
            ...links.careers,
            type: "link",
            title: "Careers",
            description: "Opportunities and culture. Join our team.",
            icon: "user",
            iconColor: "purple500",
            href: "/company/careers",
          },
          {
            ...links.security,
            type: "link",
            title: "Security",
            description: "Security report and overview of compliance",
          },
        ],
        backgroundColor: "white",
      },
    ],
  },
];

export const mobileData: HeaderProps["mobileData"] = [
  {
    name: "Features",
    maxItems: 3,
    content: [
      links.UITest,
      links.UIReview,
      links.Publish,
      links.VisualTest,
      links.interactionTest,
      links.turboSnap,
      links.figmaPlugin,
    ],
  },
  {
    content: [
      {
        title: "Pricing",
        icon: "starhollow",
        iconColor: "yellow500",
        href: "/pricing",
      },
      {
        title: "Docs",
        icon: "browser",
        iconColor: "orange500",
        href: "/docs",
      },
      {
        title: "Blog",
        icon: "grow",
        iconColor: "purple500",
        href: "/blog",
      },
      {
        title: "Contact sales",
        icon: "email",
        iconColor: "blue500",
        href: "/sales",
      },
    ],
  },
  {
    name: "Integrations",
    collapsible: true,
    content: [
      { ...links.storybook },
      { ...links.playwright },
      { ...links.cypress },
    ],
  },
  {
    name: "Use cases",
    collapsible: true,
    content: [
      { ...links.frontendTeams },
      { ...links.designSystems },
      { ...links.digitalAgencies },
    ],
  },
  {
    name: "Customer Stories",
    collapsible: true,
    content: [
      { ...links.netlify },
      { ...links.monday },
      { ...links.collective },
      { ...links.ezcater },
    ],
  },
  {
    name: "Company",
    collapsible: true,
    content: [
      { ...links.aboutChromatic },
      { ...links.careers },
      { ...links.security },
    ],
  },
];
