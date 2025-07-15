import type { Meta, StoryObj } from "@storybook/react-vite";
import { screen } from "storybook/test";
import { FilterableConfigOptions } from "./FilterableConfigOptions";
import type { FilterableConfigOptionsProps } from "./FilterableConfigOptions";
import type { ConfigOption as ConfigOptionType } from "../../../chromatic-config/generate-schema";

const meta = {
  title: "Components/FilterableConfigOptions",
  component: FilterableConfigOptions,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 796 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<FilterableConfigOptionsProps>;

export default meta;
type Story = StoryObj<FilterableConfigOptionsProps>;

const mockOptions = [
  {
    option: "autoAcceptChanges",
    flag: "--auto-accept-changes",
    description:
      "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
    type: ["glob", "boolean"],
    example: '<code>"main"</code> or <code>true</code>',
    default: "<code>false</code>",
    supports: ["CLI", "GitHub Action", "Config File"],
  },
  {
    option: "branchName",
    flag: "--branch-name",
    description:
      "Override the branch name for certain CI providers or cross-fork PR comparisons. Also accepts <code>&#x3C;owner>:&#x3C;branch></code>",
    type: "string",
    example: '<code>"my- branch"</code>',
    defaultComment: "Inferred from CI or Git",
    supports: ["CLI", "GitHub Action"],
    default: "Inferred from CI or Git",
  },
  {
    option: "buildScriptName",
    flag: "--build-script-name",
    shortFlag: "-b",
    description:
      "The npm script that builds your Storybook. Use this if your Storybook build script is named differently.",
    type: "string",
    example: '<code>"build: storybook"</code>',
    default: "<code>build-storybook</code>",
    supports: ["CLI", "GitHub Action", "Config File"],
  },
  {
    option: "configFile",
    flag: "--config.json",
    restriction: "Node.js API only",
    description: "Path from where to load the Chromatic config JSON file.",
    type: "string",
    example: '<code>"config / chromatic.json"</code>',
    default: "<code>chromatic.config.json</code>",
    supports: ["CLI", "GitHub Action"],
  },
] as ConfigOptionType[];

export const Basic: Story = {
  args: {
    options: mockOptions,
  },
};

export const OpenFilter: Story = {
  args: {
    options: mockOptions,
  },
  play: async ({ canvas, userEvent }) => {
    const FilterButton = await canvas.findByRole("button");
    await userEvent.click(FilterButton);
  },
};

export const FilterOptions: Story = {
  args: {
    options: mockOptions,
  },
  play: async ({ canvas, userEvent }) => {
    const FilterButton = await canvas.findByRole("button");

    await userEvent.click(FilterButton);

    await userEvent.click(
      await screen.findByRole("menuitemcheckbox", { name: "CLI" }),
    );

    await userEvent.click(FilterButton);
    await userEvent.click(
      await screen.findByRole("menuitemcheckbox", { name: "GitHub Action" }),
    );
  },
};

export const NoOptions: Story = {
  args: {
    options: mockOptions,
  },
  play: async ({ canvas, userEvent }) => {
    const FilterButton = await canvas.findByRole("button");

    await userEvent.click(FilterButton);

    await userEvent.click(
      await screen.findByRole("menuitemcheckbox", { name: "CLI" }),
    );

    await userEvent.click(FilterButton);
    await userEvent.click(
      await screen.findByRole("menuitemcheckbox", { name: "GitHub Action" }),
    );

    await userEvent.click(FilterButton);
    await userEvent.click(
      await screen.findByRole("menuitemcheckbox", { name: "Config File" }),
    );
  },
};
