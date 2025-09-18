import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SnapshotCalculator } from "./SnapshotCalculator";

const meta = {
  title: "Components/SnapshotCalculator",
  component: SnapshotCalculator,
} satisfies Meta<typeof SnapshotCalculator>;

export default meta;
type Story = StoryObj<typeof SnapshotCalculator>;

export const Base = {} satisfies Story;

export const WithQueryParams = {
  parameters: {
    query: {
      tests: "47",
      builds: "3",
      browsers: "2",
      viewports: "2",
      accessibility: "true",
      turboSnap: "true",
      changedTestsPercentage: "18",
    },
  },
} satisfies Story;

export const AccessibilityEnabled = {
  play: async ({ canvas, userEvent }) => {
    const checkbox = await canvas.findByLabelText("Accessibility tests");
    await userEvent.click(checkbox);
  },
} satisfies Story;

export const TurbosnapEnabled = {
  play: async ({ canvas, userEvent }) => {
    const checkbox = await canvas.findByLabelText("Enabled");
    await userEvent.click(checkbox);
  },
} satisfies Story;

export const AccessibilityAndTurbosnapEnabled = {
  play: async ({ canvas, userEvent }) => {
    const tsCheckbox = await canvas.findByLabelText("Enabled");
    await userEvent.click(tsCheckbox);
    const a11yCheckbox = await canvas.findByLabelText("Accessibility tests");

    await userEvent.click(a11yCheckbox);
  },
} satisfies Story;

export const VerifyMath = {
  parameters: {
    query: {
      tests: "50",
      builds: "1",
      browsers: "2",
      viewports: "2",
      accessibility: "true",
      turboSnap: "true",
      changedTestsPercentage: "20",
    },
  },
  play: async ({ canvas }) => {
    const snapshots = await canvas.findByTestId("snapshots");
    const turboSnaps = await canvas.findByTestId("turboSnaps");
    const billedSnapshots = await canvas.findByTestId("billedSnapshots");

    expect(snapshots).toHaveTextContent("60Snapshots");
    expect(turboSnaps).toHaveTextContent("160TurboSnaps");
    expect(billedSnapshots).toHaveTextContent("92Billed snapshots");
  },
} satisfies Story;
