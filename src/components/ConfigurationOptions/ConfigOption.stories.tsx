import type { Meta, StoryObj } from "@storybook/react-vite";
import { ConfigOption } from "./ConfigOption";
import type { ConfigOptionProps } from "./ConfigOption";

const meta = {
  title: "Components/ConfigOption",
  component: ConfigOption,
  decorators: [
    (Story) => (
      <div style={{ maxWidth: 796 }}>
        <Story />
      </div>
    ),
  ],
} satisfies Meta<ConfigOptionProps>;

export default meta;
type Story = StoryObj<ConfigOptionProps>;

export const Basic: Story = {
  args: {
    supports: ["GitHub Action", "CLI"],
    option: "autoAcceptChanges",
    flag: "--auto-accept-changes",
    description:
      "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
    type: "string",
    example: '<code>"my-folder/**"</code>',
  },
};

export const WithHTMLDesc: Story = {
  args: {
    ...Basic.args,
    description:
      "When enabled, write the build results to a JUnit XML file.<br/>Defaults to <code>chromatic-build-{buildNumber}.xml</code> where the <code>{buildNumber}</code> will be replaced with the actual build number.",
  },
};

export const UnionType: Story = {
  args: {
    ...Basic.args,
    type: ["glob", "boolean"],
  },
};

export const ArrayOfGlobType: Story = {
  args: {
    ...Basic.args,
    type: "array of glob",
  },
};

export const DefaultValue: Story = {
  args: {
    ...Basic.args,
    default: '<code>"build-storybook.log"</code>',
  },
};

export const DefaultValueComment: Story = {
  args: {
    ...Basic.args,
    default: "Inferred from CI or Git",
  },
};

export const ExampleComplex: Story = {
  args: {
    ...Basic.args,
    example: '<code>"report.xml"</code> or <code>true</code>',
  },
};

export const ShortFlag: Story = {
  args: {
    ...ExampleComplex.args,
    flag: "--output-dir",
    shortFlag: "-o",
  },
};

export const Everything: Story = {
  args: {
    ...ShortFlag.args,
    default: '<code>"build-storybook.log"</code>',
    supports: ["GitHub Action", "CLI", "Config File"],
  },
};

export const SupportsAll: Story = {
  args: {
    ...Basic.args,
    supports: ["GitHub Action", "CLI", "Config File"],
  },
};

export const OnlyCLI: Story = {
  args: {
    option: "--auto-accept-changes",
    flag: "--auto-accept-changes",
    description:
      "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
    type: "string",
    example: '<code>"my-folder/**"</code>',
    supports: ["CLI"],
  },
};

export const OnlyCI: Story = {
  args: {
    option: "autoAcceptChanges",
    flag: "--auto-accept-changes",
    description:
      "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
    type: "string",
    example: '<code>"my-folder/**"</code>',
    supports: ["GitHub Action"],
  },
};
