import type { Meta, StoryObj } from "@storybook/react";
import type { SidebarItem } from "./SideNav";
import { SideNav } from "./SideNav";

const meta = {
  title: "Components/SideNav",
  component: SideNav,
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof SideNav>;

const mockSidebarItems: SidebarItem[] = [
  {
    title: "Overview",
    items: [
      {
        id: "introduction.mdx",
        slug: "introduction",
        collection: "overview",
        data: {
          title: "Introduction",
          sidebar: {
            label: "Introduction",
            order: 1,
            hide: false,
          },
          isHome: true,
        },
      },
      {
        id: "test.mdx",
        slug: "test",
        collection: "overview",
        data: {
          title: "Test",
          sidebar: {
            label: "UI Tests",
            order: 2,
            hide: false,
          },
        },
      },
      {
        id: "review.md",
        slug: "review",
        collection: "overview",
        data: {
          title: "Review",
          sidebar: {
            label: "UI Review",
            order: 3,
            hide: false,
          },
        },
      },
      {
        id: "ci.mdx",
        slug: "ci",
        collection: "overview",
        data: {
          title: "Automate with CI",
          sidebar: {
            label: "Automate with CI",
            order: 4,
            hide: false,
          },
        },
      },
      {
        id: "diff-inspector.mdx",
        slug: "diff-inspector",
        collection: "overview",
        data: {
          title: "Diff Inspector",
          sidebar: {
            label: "Diff Inspector",
            order: 5,
            hide: false,
          },
        },
      },
    ],
  },
  {
    title: "Storybook",
    items: [
      {
        id: "setup.mdx",
        slug: "storybook",
        collection: "storybook",
        data: {
          title: "Setup",
          sidebar: {
            label: "Setup",
            order: 1,
            hide: false,
          },
        },
      },
      {
        id: "interactions.md",
        slug: "interactions",
        collection: "storybook",
        data: {
          title: "Interaction tests",
          sidebar: {
            label: "Interaction tests",
            order: 2,
            hide: false,
          },
        },
      },
      {
        id: "publish.md",
        slug: "storybook/publish",
        collection: "storybook",
        data: {
          title: "Publish",
          sidebar: {
            label: "Publish",
            order: 3,
            hide: false,
          },
        },
      },
      {
        id: "composition.md",
        slug: "composition",
        collection: "storybook",
        data: {
          title: "Composition",
          sidebar: {
            label: "Composition",
            order: 4,
            hide: false,
          },
        },
      },
    ],
  },
];

export const Default: Story = {
  args: {
    sidebarItems: mockSidebarItems,
  },
};

export const DefaultOpen: Story = {
  args: {
    sidebarItems: [
      { ...mockSidebarItems[0], defaultOpen: true },
      mockSidebarItems[1],
    ],
  },
};

export const WithActiveUrl: Story = {
  args: {
    url: "/docs/test",
    sidebarItems: [
      { ...mockSidebarItems[0], defaultOpen: true },
      mockSidebarItems[1],
    ],
  },
};

export const WithActiveUrlInClosedGroup: Story = {
  args: {
    url: "/docs/storybook",
    sidebarItems: [
      { ...mockSidebarItems[0], defaultOpen: true },
      mockSidebarItems[1],
    ],
  },
};

export const Timeline: Story = {
  args: {
    url: "/docs/test",
    sidebarItems: [
      { ...mockSidebarItems[0], defaultOpen: true, timeline: true },
      mockSidebarItems[1],
    ],
  },
};
