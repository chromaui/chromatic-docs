import type { Meta, StoryObj } from "@storybook/react";
import { YouTubeCallout } from "./YouTubeCallout";

const meta = {
  title: "Components/YouTubeCallout",
  component: YouTubeCallout,
} satisfies Meta<typeof YouTubeCallout>;

export default meta;
type Story = StoryObj<typeof YouTubeCallout>;

export const Closed: Story = {
  args: {
    id: "BDuQb8jdz-c",
    summary: "Watch a quick demo of how modes work",
  },
};

export const Open: Story = {
  args: {
    ...Closed.args,
    open: true,
  },
};
