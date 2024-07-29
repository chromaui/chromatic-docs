import type { Meta, StoryObj } from "@storybook/react";
import { ConfigOption } from "./ConfigOption";

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
} satisfies Meta<typeof ConfigOption>;

export default meta;
type Story = StoryObj<typeof ConfigOption>;

export const Basic = {
  args: {
    option: "autoAcceptChanges",
    flag: "--auto-accept-changes",
    description:
      "If there are any changes to the build, automatically accept them. Only for given branch, if specified.",
    type: "string",
  },
};

export const WithHTMLDesc = {
  args: {
    ...Basic.args,
    description:
      "When enabled, write the build results to a JUnit XML file.<br/>Defaults to <code>chromatic-build-{buildNumber}.xml</code> where the <code>{buildNumber}</code> will be replaced with the actual build number.",
  },
};

export const UnionType = {
  args: {
    ...Basic.args,
    type: ["glob", "boolean"],
  },
};

export const ArrayOfGlobType = {
  args: {
    ...Basic.args,
    type: "array of glob",
  },
};

export const HasExample = {
  args: {
    ...Basic.args,
    example: '<code>"report.xml"</code> or <code>true</code>',
  },
};
