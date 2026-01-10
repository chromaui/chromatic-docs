import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect } from "storybook/test";
import { SnapshotCalculator } from "./SnapshotCalculator";

const meta = {
  title: "Components/SnapshotCalculator",
  component: SnapshotCalculator,
  tags: ["!test"], // Disables testing for this story until https://github.com/storybook-community/addon-queryparams/pull/15 is merged and released
} satisfies Meta<typeof SnapshotCalculator>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Base: Story = {};

export const WithQueryParams: Story = {
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
};

export const AccessibilityEnabled: Story = {
  play: async ({ canvas, userEvent }) => {
    const checkbox = await canvas.findByLabelText("Accessibility tests");
    await userEvent.click(checkbox);
  },
};

export const TurbosnapEnabled: Story = {
  play: async ({ canvas, userEvent }) => {
    const checkbox = await canvas.findByLabelText("Enabled");
    await userEvent.click(checkbox);
  },
};

export const AccessibilityAndTurbosnapEnabled: Story = {
  play: async ({ canvas, userEvent }) => {
    const tsCheckbox = await canvas.findByLabelText("Enabled");
    await userEvent.click(tsCheckbox);
    const a11yCheckbox = await canvas.findByLabelText("Accessibility tests");

    await userEvent.click(a11yCheckbox);
  },
};

export const VerifyMath: Story = {
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
};
