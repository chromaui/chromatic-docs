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
type Story = StoryObj<typeof SideNav>;

export const Default = {
  args: {
    sidebarGroups: [mockGroupOverview, mockGroupStorybook],
  },
} satisfies Story;

export const DefaultOpen = {
  args: {
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true },
      mockGroupStorybook,
    ],
  },
} satisfies Story;

export const WithActiveUrl = {
  args: {
    url: "/docs/test",
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true },
      mockGroupStorybook,
    ],
  },
} satisfies Story;

export const WithActiveUrlInClosedGroup = {
  args: {
    url: "/docs/storybook",
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true },
      mockGroupStorybook,
    ],
  },
} satisfies Story;

export const Timeline = {
  args: {
    url: "/docs/test",
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true, timeline: true },
      mockGroupStorybook,
    ],
  },
} satisfies Story;

export const Nested = {
  args: {
    sidebarGroups: [
      { ...mockGroupOverview, defaultOpen: true },
      mockGroupWithNested,
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

export const MultiLevelNesting = {
  args: {
    sidebarGroups: [mockGroupOverview, mockGroupWithMultiLevelNested],
    url: "/docs/turbosnap/setup",
  },
} satisfies Story;
