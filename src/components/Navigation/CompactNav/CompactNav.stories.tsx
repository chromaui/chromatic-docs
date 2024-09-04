import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import { CompactNav } from "./CompactNav";
import type { TransformedItem } from "../types";
import {
  mockGroupOverview,
  mockGroupStorybook,
  mockGroupWithNested,
} from "../CollapsibleGroup.stories";

const meta = {
  title: "Components/Navigation/CompactNav",
  component: CompactNav,
  parameters: {
    viewport: {
      defaultViewport: "mobile2",
    },
  },
} satisfies Meta<typeof CompactNav>;

export default meta;
type Story = StoryObj<typeof CompactNav>;

export const Collapsed = {
  args: {
    groups: [mockGroupOverview, mockGroupStorybook],
    activeItem: mockGroupOverview.items[0] as TransformedItem,
  },
} satisfies Story;

export const OneGroup = {
  args: {
    groups: [mockGroupOverview],
    activeItem: mockGroupOverview.items[0] as TransformedItem,
    url: "/docs/test",
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
    groups: [mockGroupOverview, mockGroupStorybook],
    activeItem: mockGroupStorybook.items[0] as TransformedItem,
    url: "/docs/storybook",
  },
  decorators: [(storyFn) => <div style={{ height: "800px" }}>{storyFn()}</div>],
  play: OneGroup.play,
} satisfies Story;

export const NestedGroups = {
  args: {
    groups: [mockGroupOverview, mockGroupWithNested],
    activeItem: mockGroupWithNested.items[0] as TransformedItem,
    url: "/docs/themes",
  },
  decorators: [(storyFn) => <div style={{ height: "800px" }}>{storyFn()}</div>],
  play: OneGroup.play,
} satisfies Story;
