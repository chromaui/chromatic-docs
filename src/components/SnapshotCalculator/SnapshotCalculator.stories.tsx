import type { Meta, StoryObj } from "@storybook/react";
import { within, userEvent } from "@storybook/test";
import { SnapshotCalculator } from "./SnapshotCalculator";

const meta = {
  title: "Components/SnapshotCalculator",
  component: SnapshotCalculator,
} satisfies Meta<typeof SnapshotCalculator>;

export default meta;
type Story = StoryObj<typeof SnapshotCalculator>;

export const Base = {} satisfies Story;

export const AccessibilityEnabled = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = await canvas.findByLabelText("Accessibility tests");
    await userEvent.click(checkbox);
  },
} satisfies Story;

export const TurbosnapEnabled = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = await canvas.findByLabelText("Enabled");
    await userEvent.click(checkbox);
  },
} satisfies Story;

export const AccessibilityAndTurbosnapEnabled = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const tsCheckbox = await canvas.findByLabelText("Enabled");
    await userEvent.click(tsCheckbox);
    const a11yCheckbox = await canvas.findByLabelText("Accessibility tests");
    await userEvent.click(a11yCheckbox);
  },
} satisfies Story;
