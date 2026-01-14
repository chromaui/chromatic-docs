import type { Meta, StoryObj } from "@storybook/react-vite";
import { SideNav } from "./SideNav";
import {
  mockGroupOverview,
  mockGroupStorybook,
  mockGroupWithNested,
  mockGroupWithMultiLevelNested,
} from "../CollapsibleGroup.stories";

const meta = {
  title: "Components/Navigation/SideNav",
  component: SideNav,
} satisfies Meta<typeof SideNav>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sidebarGroups: [mockGroupOverview, mockGroupStorybook],
    url: "",
  },
};

export const DefaultOpen: Story = {
  args: {
    ...Default.args,
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true },
      mockGroupStorybook,
    ],
  },
};

export const WithActiveUrl: Story = {
  args: {
    url: "/docs/test",
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true },
      mockGroupStorybook,
    ],
  },
};

export const WithActiveUrlInClosedGroup: Story = {
  args: {
    url: "/docs/storybook",
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true },
      mockGroupStorybook,
    ],
  },
};

export const Timeline: Story = {
  args: {
    url: "/docs/test",
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true, timeline: true },
      mockGroupStorybook,
    ],
  },
};

export const Nested: Story = {
  args: {
    ...Default.args,
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true },
      mockGroupWithNested,
    ],
  },
};

export const NestedActive: Story = {
  args: {
    sidebarGroups: Nested.args.sidebarGroups,
    url: "/docs/storybook",
  },
};

export const NestedDeepActive: Story = {
  args: {
    sidebarGroups: Nested.args.sidebarGroups,
    url: "/docs/themes",
  },
};

export const MultiLevelNesting: Story = {
  args: {
    sidebarGroups: [mockGroupOverview, mockGroupWithMultiLevelNested],
    url: "/docs/turbosnap/setup",
  },
};
