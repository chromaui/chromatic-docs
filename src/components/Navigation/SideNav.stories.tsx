import type { Meta, StoryObj } from "@storybook/react";
import { SideNav } from "./SideNav";
import type { TransformedNavGroup, TransformedNavGroupItem } from "./types";

const meta = {
  title: "Components/SideNav",
  component: SideNav,
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof SideNav>;

const mockSidebarGroups: TransformedNavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        hide: false,
        label: "Introduction",
        order: 1,
        slug: "",
        isHome: true,
      },
      {
        hide: false,
        label: "UI Tests",
        order: 2,
        slug: "test",
        isHome: false,
      },
      {
        hide: false,
        label: "UI Review",
        order: 3,
        slug: "review",
        isHome: false,
      },
      {
        hide: false,
        label: "Automate with CI",
        order: 4,
        slug: "ci",
        isHome: false,
      },
      {
        hide: false,
        label: "Diff Inspector",
        order: 5,
        slug: "diff-inspector",
        isHome: false,
      },
    ],
  },
  {
    title: "Storybook",
    items: [
      {
        hide: false,
        label: "Setup",
        order: 1,
        slug: "storybook",
        isHome: false,
      },
      {
        hide: false,
        label: "Interaction tests",
        order: 2,
        slug: "interactions",
        isHome: false,
      },
      {
        hide: false,
        label: "Publish",
        order: 3,
        slug: "storybook/publish",
        isHome: false,
      },
      {
        hide: false,
        label: "Composition",
        order: 4,
        slug: "composition",
        isHome: false,
      },
    ],
  },
];

const mockWithNestedGroups: TransformedNavGroup = {
  ...mockSidebarGroups[1],
  items: mockSidebarGroups[1].items.concat([
    {
      hide: false,
      items: [
        {
          hide: false,
          label: "Story Modes",
          order: 1,
          slug: "modes",
          isHome: false,
        },
        {
          hide: false,
          label: "Themes",
          order: 3,
          slug: "themes",
          isHome: false,
        },
        {
          hide: false,
          label: "Custom decorators",
          order: 4,
          slug: "custom-decorators",
          isHome: false,
        },
        {
          hide: false,
          label: "Viewports (legacy)",
          order: 5,
          slug: "legacy-viewports",
          isHome: false,
        },
      ],
      order: 999,
      title: "Modes",
    },
  ]),
};

export const Default = {
  args: {
    sidebarGroups: mockSidebarGroups,
  },
} satisfies Story;

export const DefaultOpen = {
  args: {
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true },
      mockSidebarGroups[1],
    ],
  },
} satisfies Story;

export const WithActiveUrl = {
  args: {
    url: "/docs/test",
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true },
      mockSidebarGroups[1],
    ],
  },
} satisfies Story;

export const WithActiveUrlInClosedGroup = {
  args: {
    url: "/docs/storybook",
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true },
      mockSidebarGroups[1],
    ],
  },
} satisfies Story;

export const Timeline = {
  args: {
    url: "/docs/test",
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true, timeline: true },
      mockSidebarGroups[1],
    ],
  },
} satisfies Story;

export const Nested = {
  args: {
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true },
      mockWithNestedGroups,
    ],
  },
} satisfies Story;

export const NestedActive = {
  args: {
    sidebarGroups: Nested.args.sidebarGroups,
    url: "/docs/storybook",
  },
} satisfies Story;

export const NestedDeepActive = {
  args: {
    sidebarGroups: Nested.args.sidebarGroups,
    url: "/docs/themes",
  },
} satisfies Story;

const mockWithMultiLevelNestedGroups: TransformedNavGroup = {
  ...mockSidebarGroups[1],
  items: mockSidebarGroups[1].items.concat([
    {
      hide: false,
      items: [
        {
          hide: false,
          label: "Story Modes",
          order: 1,
          slug: "modes",
          isHome: false,
        },
        {
          hide: false,
          label: "Themes",
          order: 3,
          slug: "themes",
          isHome: false,
        },
        {
          hide: false,
          label: "Custom decorators",
          order: 4,
          slug: "custom-decorators",
          isHome: false,
        },
        {
          hide: false,
          label: "Viewports (legacy)",
          order: 5,
          slug: "legacy-viewports",
          isHome: false,
        },
        {
          hide: false,
          items: [
            {
              hide: false,
              label: "Overview",
              order: 1,
              slug: "turbosnap",
              isHome: false,
            },
            {
              hide: false,
              label: "Setup",
              order: 3,
              slug: "turbosnap/setup",
              isHome: false,
            },
          ],
          order: 999,
          title: "TurboSnap",
        },
      ],
      order: 999,
      title: "Modes",
    },
  ]),
};

export const MultiLevelNesting = {
  args: {
    sidebarGroups: [mockSidebarGroups[0], mockWithMultiLevelNestedGroups],
    url: "/docs/turbosnap/setup",
  },
} satisfies Story;
