import { color } from "@chromaui/tetra";
import type { HeaderProps, Icons } from "@chromaui/tetra";
import React from "react";

import { CollectiveIcon } from "./icons/collective";
import { FigmaIcon } from "./icons/figma";
import { MondayIcon } from "./icons/monday";
import { NetlifyIcon } from "./icons/netlify";

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
    title: "Visual Test",
    icon: "eye",
    iconColor: "purple500",
    href: "/features/visual-test",
  },
  interactionTest: {
    title: "Interaction Test",
    icon: "pointerhand",
    iconColor: "orange500",
    href: "/features/interaction-test",
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
  madeForStorybook: {
    title: "Made for Storybook",
    icon: "contrast",
    iconColor: "cyan500",
    href: "/solutions/storybook",
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
  blog: {
    title: "Blog",
    icon: "star",
    iconColor: "blue500",
    href: "/blog",
  },
  careers: {
    title: "Careers",
    icon: "user",
    iconColor: "purple500",
    href: "/company/careers",
  },
};

export const desktopData: HeaderProps["desktopData"] = [
  {
    id: "features",
    name: "Features",
    leftPosition: -20,
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
        backgroundColor: "blue50",
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
            ...links.madeForStorybook,
            type: "link",
            description: "Ship UI components with less manual work",
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
            title: "Netlify",
            customIcon: <NetlifyIcon />,
            href: "/customers/netlify",
          },
          {
            type: "link",
            title: "monday.com",
            description: "How 200 developers speed up their frontend velocity",
            customIcon: <MondayIcon />,
            href: "/customers/monday",
          },
          {
            type: "link",
            title: "Collective.work",
            description:
              "How to deliver personalized UX across borders & devices",
            customIcon: <CollectiveIcon />,
            href: "/customers/collective",
          },
        ],
        backgroundColor: "blue50",
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
    name: "Changelog",
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
            ...links.blog,
            type: "link",
            description: "Product updates, news, and changes from Chromatic",
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
      {
        ...links.UITest,
      },
      {
        ...links.UIReview,
      },
      {
        ...links.Publish,
      },
      {
        ...links.VisualTest,
      },
      {
        ...links.interactionTest,
      },
      {
        ...links.turboSnap,
      },
      {
        ...links.figmaPlugin,
      },
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
        title: "Changelog",
        icon: "grow",
        iconColor: "purple500",
        href: "/blog/releases",
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
    name: "Use cases",
    collapsible: true,
    content: [
      {
        ...links.madeForStorybook,
      },
      {
        ...links.frontendTeams,
      },
      {
        ...links.designSystems,
      },
      {
        ...links.digitalAgencies,
      },
    ],
  },
  {
    name: "Customer Stories",
    collapsible: true,
    content: [
      {
        title: "monday.com",
        customIcon: <MondayIcon />,
        href: "/customers/monday",
      },
      {
        title: "Collective.work",
        customIcon: <CollectiveIcon />,
        href: "/customers/collective",
      },
      // {
      //   title: 'BBC',
      //   customIcon: <BBCIcon />,
      //   href: '/',
      // },
    ],
  },
  {
    name: "Company",
    collapsible: true,
    content: [
      {
        ...links.aboutChromatic,
      },
      {
        ...links.blog,
        href: "/blog",
      },
      {
        ...links.careers,
      },
    ],
  },
];
