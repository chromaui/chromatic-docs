import type { Meta, StoryObj } from "@storybook/react-vite";
import { within } from "storybook/test";

import { InfoTooltip } from "./InfoTooltip";

const meta = {
  title: "Components/InfoTooltip",
  component: InfoTooltip,
  parameters: {
    layout: "padded",
  },
  globals: {
    backgrounds: { value: "dark" },
  },
  decorators: [
    (storyFn) => (
      <div style={{ width: "800px", height: "600px" }}>{storyFn()}</div>
    ),
  ],
} satisfies Meta<typeof InfoTooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    copy: "Stories capture the “known good” states of UI components. They’re a pragmatic, reproducible way to keep track of UI edge cases. Reuse stories to power automated tests.",
    link: {
      title: "Learn more",
      href: "/features/stories",
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    button.focus();
  },
  name: "InfoTooltip",
};
