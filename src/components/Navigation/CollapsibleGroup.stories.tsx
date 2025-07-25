import type { Meta, StoryObj } from "@storybook/react-vite";
import { CollapsibleGroup } from "./CollapsibleGroup";
import type { NestedTransformedGroup, TransformedNavGroup } from "./types";

const meta = {
  title: "Components/Navigation/CollapsibleGroup",
  component: CollapsibleGroup,
  excludeStories: /^mock.*/,
} satisfies Meta<typeof CollapsibleGroup>;

export default meta;
type Story = StoryObj<typeof CollapsibleGroup>;

export const mockGroupOverview: TransformedNavGroup = {
  title: "Overview",
  items: [
    {
      hide: false,
      label: "Introduction",
      order: 1,
      id: "",
      isHome: true,
      breadcrumb: "Overview",
    },
    {
      hide: false,
      label: "UI Tests",
      order: 2,
      id: "test",
      isHome: false,
      breadcrumb: "Overview",
    },
    {
      hide: false,
      label: "UI Review",
      order: 3,
      id: "review",
      isHome: false,
      breadcrumb: "Overview",
    },
    {
      hide: false,
      label: "Automate with CI",
      order: 4,
      id: "ci",
      isHome: false,
      breadcrumb: "Overview",
    },
    {
      hide: false,
      label: "Diff Inspector",
      order: 5,
      id: "diff-inspector",
      isHome: false,
      breadcrumb: "Overview",
    },
  ],
};

export const mockGroupStorybook: TransformedNavGroup = {
  title: "Storybook",
  items: [
    {
      hide: false,
      label: "Setup",
      order: 1,
      id: "storybook",
      isHome: false,
      breadcrumb: "Storybook",
    },
    {
      hide: false,
      label: "Interaction tests",
      order: 2,
      id: "interactions",
      isHome: false,
      breadcrumb: "Storybook",
    },
    {
      hide: false,
      label: "Publish",
      order: 3,
      id: "storybook/publish",
      isHome: false,
      breadcrumb: "Storybook",
    },
    {
      hide: false,
      label: "Composition",
      order: 4,
      id: "composition",
      isHome: false,
      breadcrumb: "Storybook",
    },
  ],
};

const mockModes: NestedTransformedGroup = {
  hide: false,
  items: [
    {
      hide: false,
      label: "Story Modes",
      order: 1,
      id: "modes",
      isHome: false,
      breadcrumb: "Storybook » Modes",
    },
    {
      hide: false,
      label: "Themes",
      order: 3,
      id: "themes",
      isHome: false,
      breadcrumb: "Storybook » Modes",
    },
    {
      hide: false,
      label: "Custom decorators",
      order: 4,
      id: "custom-decorators",
      isHome: false,
      breadcrumb: "Storybook » Modes",
    },
    {
      hide: false,
      label: "Viewports (legacy)",
      order: 5,
      id: "legacy-viewports",
      isHome: false,
      breadcrumb: "Storybook » Modes",
    },
  ],
  order: 999,
  title: "Modes",
};

const mockTS = {
  hide: false,
  items: [
    {
      hide: false,
      label: "Overview",
      order: 1,
      id: "turbosnap",
      isHome: false,
      breadcrumb: "Storybook » Modes » TurboSnap",
    },
    {
      hide: false,
      label: "Setup",
      order: 3,
      id: "turbosnap/setup",
      isHome: false,
      breadcrumb: "Storybook » Modes » TurboSnap",
    },
  ],
  order: 999,
  title: "TurboSnap",
};

export const mockGroupWithNested: TransformedNavGroup = {
  ...mockGroupStorybook,
  items: mockGroupStorybook.items.concat([mockModes, mockTS]),
};

const TSInModes = {
  ...mockModes,
  items: mockModes.items.concat([mockTS]),
};

export const mockGroupWithMultiLevelNested: TransformedNavGroup = {
  ...mockGroupStorybook,
  items: mockGroupStorybook.items.concat(TSInModes),
};

export const Default = {
  args: {
    group: mockGroupOverview,
  },
} satisfies Story;

export const DefaultOpen = {
  args: {
    group: { ...mockGroupOverview, defaultOpen: true },
  },
} satisfies Story;

export const WithActiveUrl = {
  args: {
    url: "/docs/test",
    group: { ...mockGroupOverview, defaultOpen: true },
  },
} satisfies Story;

export const WithActiveUrlInClosedGroup = {
  args: {
    url: "/docs/storybook",
    group: mockGroupStorybook,
  },
} satisfies Story;

export const Timeline = {
  args: {
    url: "/docs/test",
    group: { ...mockGroupOverview, defaultOpen: true, timeline: true },
  },
} satisfies Story;

export const Nested = {
  args: {
    group: { ...mockGroupWithNested, defaultOpen: true },
  },
} satisfies Story;

export const NestedActive = {
  args: {
    group: Nested.args.group,
    url: "/docs/storybook",
  },
} satisfies Story;

export const NestedDeepActive = {
  args: {
    group: Nested.args.group,
    url: "/docs/themes",
  },
} satisfies Story;

export const MultiLevelNesting = {
  args: {
    group: mockGroupWithMultiLevelNested,
    url: "/docs/turbosnap/setup",
  },
} satisfies Story;
