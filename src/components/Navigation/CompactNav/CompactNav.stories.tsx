import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import { CompactNav } from "./CompactNav";
import type { TransformedNavGroup } from "../types";

const meta = {
  title: "Components/CompactNav",
  component: CompactNav,
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
} satisfies Meta<typeof CompactNav>;

export default meta;
type Story = StoryObj<typeof CompactNav>;

const mockSidebarItems: TransformedNavGroup[] = [
  {
    title: "Overview",
    items: [
      {
        id: "introduction.mdx",
        slug: "introduction",
        label: "Introduction",
      },
      {
        id: "test.mdx",
        slug: "test",
        label: "UI Test",
      },
      {
        id: "review.md",
        slug: "review",
        label: "UI Review",
      },
      {
        id: "ci.mdx",
        slug: "ci",
        label: "GitHub Action",
      },
      {
        id: "diff-inspector.mdx",
        slug: "diff-inspector",
        label: "Diff Inspector",
      },
    ],
  },
  {
    title: "Storybook",
    items: [
      {
        id: "setup.mdx",
        slug: "storybook",
        label: "Setup",
      },
      {
        id: "interactions.md",
        slug: "interactions",
        label: "Interaction tests",
      },
      {
        id: "publish.md",
        slug: "storybook/publish",
        label: "Publish",
      },
      {
        id: "composition.md",
        slug: "composition",
        label: "Composition",
      },
    ],
  },
];

export const Collapsed = {
  args: {
    groups: mockSidebarItems,
  },
} satisfies Story;

export const OneGroup = {
  args: {
    groups: [mockSidebarItems[0]],
  },
  decorators: [(storyFn) => <div style={{ height: "800px" }}>{storyFn()}</div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const MenuButton = await canvas.findByRole("button");
    await userEvent.click(MenuButton);
  },
} satisfies Story;

export const MultipleGroups = {
  args: {
    groups: mockSidebarItems,
  },
  decorators: [(storyFn) => <div style={{ height: "800px" }}>{storyFn()}</div>],
  play: OneGroup.play,
} satisfies Story;

export const ActiveUrlBreadcrumb = {
  args: {
    url: "/docs/storybook",
    groups: mockSidebarItems,
  },
  decorators: [(storyFn) => <div style={{ height: "800px" }}>{storyFn()}</div>],
  play: OneGroup.play,
} satisfies Story;
