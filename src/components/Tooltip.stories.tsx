import { Icon } from "@chromatic-com/tetra";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { within } from "storybook/test";

import { Tooltip } from "./Tooltip";

const meta = {
  title: "Components/Tooltip",
  component: Tooltip,
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
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    trigger: <Icon name="info" aria-label="Info" color="slate600" />,
    copy: "Stories capture the “known good” states of UI components. They’re a pragmatic, reproducible way to keep track of UI edge cases. Reuse stories to power automated tests.",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button");
    button.focus();
  },
  name: "Tooltip",
};
