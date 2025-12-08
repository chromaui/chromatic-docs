import {
  CollectiveIcon,
  CypressIcon,
  EzCaterIcon,
  FigmaIcon,
  MondayIcon,
  NetlifyIcon,
  PlaywrightIcon,
} from "@chromatic-com/tetra";

import type { HeaderProps } from "@chromatic-com/tetra";

export const links: HeaderProps["links"] = {
  signin: {
    title: "Sign in",
    href: "/start",
  },
  signup: {
    title: "Sign up",
    href: "/start?startWithSignup=true",
  },
  uiTest: {
    title: "UI Tests",
    icon: "contrast",
    iconColor: "cyan500",
    href: "/features/test",
  },
  visualTest: {
    title: "Visual test",
    icon: "eye",
    iconColor: "purple500",
    href: "/features/visual-test",
  },
  accessibilityTest: {
    title: "Accessibility test",
    icon: "accessibility",
    iconColor: "green500",
    href: "/features/accessibility-test",
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
  uiReview: {
    title: "UI Review",
    icon: "batchaccept",
    iconColor: "green500",
    href: "/features/review",
  },
  publish: {
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
  enterprise: {
    title: "Enterprise",
    icon: "admin",
    iconColor: "green500",
    href: "/enterprise",
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
  blog: {
    title: "Blog",
    icon: "starhollow",
    iconColor: "purple500",
    href: "/blog",
  },
  changelog: {
    title: "Changelog",
    icon: "book",
    iconColor: "green500",
    href: "/blog/releases",
  },
  frontendTestingGuide: {
    title: "Frontend testing guide",
    href: "/frontend-testing-guide",
  },
  docs: {
    title: "Docs",
    icon: "browser",
    iconColor: "orange500",
    href: "/docs",
  },
  pricing: {
    title: "Pricing",
    href: "/pricing",
    icon: "starhollow",
    iconColor: "yellow500",
  },
  sales: {
    title: "Contact sales",
    icon: "email",
    iconColor: "blue500",
    href: "/sales",
  },
  steadySnap: {
    title: "SteadySnap",
    icon: "photostabilize",
    iconColor: "yellow500",
    href: "/features/steadysnap",
  },
  snapshotCalculator: {
    title: "Snapshot calculator",
    icon: "photo",
    iconColor: "blue500",
    href: "/snapshot-calculator",
  },
  accessibilityBudgetCalculator: {
    title: "Accessibility budget calculator",
    icon: "accessibility",
    iconColor: "green500",
    href: "/accessibility-budget-calculator",
  },
};
