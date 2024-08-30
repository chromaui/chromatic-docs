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

export const Default: Story = {
  args: {
    sidebarGroups: mockSidebarGroups,
  },
};

export const DefaultOpen: Story = {
  args: {
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true },
      mockSidebarGroups[1],
    ],
  },
};

export const Nested: Story = {
  args: {
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true },
      mockWithNestedGroups,
    ],
  },
};

export const NestedOpen: Story = {
  args: {
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true },
      mockWithNestedGroups,
    ],
  },
};

export const WithActiveUrl: Story = {
  args: {
    url: "/docs/test",
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true },
      mockSidebarGroups[1],
    ],
  },
};

export const WithActiveUrlInClosedGroup: Story = {
  args: {
    url: "/docs/storybook",
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true },
      mockSidebarGroups[1],
    ],
  },
};

export const Timeline: Story = {
  args: {
    url: "/docs/test",
    sidebarGroups: [
      { ...mockSidebarGroups[0], defaultOpen: true, timeline: true },
      mockSidebarGroups[1],
    ],
  },
};
