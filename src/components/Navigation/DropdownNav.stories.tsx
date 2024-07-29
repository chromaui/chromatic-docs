import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import type { DropdownNavGroup } from "./DropdownNav";
import { DropdownNav } from "./DropdownNav";

const meta = {
  title: "Components/DropdownNav",
  component: DropdownNav,
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
} satisfies Meta<typeof DropdownNav>;

export default meta;
type Story = StoryObj<typeof DropdownNav>;

const mockSidebarItems: DropdownNavGroup[] = [
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
        label: "CI",
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

export const Collapsed: Story = {
  args: {
    groups: mockSidebarItems,
  },
};

export const OneGroup: Story = {
  args: {
    groups: [mockSidebarItems[0]],
  },
  decorators: [(storyFn) => <div style={{ height: "800px" }}>{storyFn()}</div>],
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const MenuButton = await canvas.findByRole("button");
    await userEvent.click(MenuButton);
  },
};

export const MultipleGroups: Story = {
  args: {
    groups: mockSidebarItems,
  },
  decorators: [(storyFn) => <div style={{ height: "800px" }}>{storyFn()}</div>],
  play: OneGroup.play,
};

export const ActiveUrlBreadcrumb: Story = {
  args: {
    url: "/docs/storybook",
    groups: mockSidebarItems,
  },
  decorators: [(storyFn) => <div style={{ height: "800px" }}>{storyFn()}</div>],
  play: OneGroup.play,
};
