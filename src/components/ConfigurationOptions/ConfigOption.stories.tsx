import type { Meta, StoryObj } from '@storybook/react-vite';
import { ConfigOption } from './ConfigOption';

const meta = {
  title: 'Components/ConfigOption',
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
type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  args: {
    name: 'Auto accept changes',
    supports: ['GitHub Action', 'CLI'],
    option: 'autoAcceptChanges',
    flag: '--auto-accept-changes',
    description:
      'If there are any changes to the build, automatically accept them. Only for given branch, if specified.',
    type: 'string',
    example: '<code>"my-folder/**"</code>',
  },
};

export const WithHTMLDesc: Story = {
  args: {
    ...Basic.args,
    description:
      'When enabled, write the build results to a JUnit XML file.<br/>Defaults to <code>chromatic-build-{buildNumber}.xml</code> where the <code>{buildNumber}</code> will be replaced with the actual build number.',
  },
};

export const UnionType: Story = {
  args: {
    ...Basic.args,
    type: ['glob', 'boolean'],
  },
};

export const ArrayOfGlobType: Story = {
  args: {
    ...Basic.args,
    type: 'array of glob',
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
    default: 'Inferred from CI or Git',
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
    flag: '--output-dir',
    shortFlag: '-o',
  },
};

export const Everything: Story = {
  args: {
    ...ShortFlag.args,
    default: '<code>"build-storybook.log"</code>',
    supports: ['GitHub Action', 'CLI', 'Config File'],
  },
};

export const SupportsAll: Story = {
  args: {
    ...Basic.args,
    supports: ['GitHub Action', 'CLI', 'Config File'],
  },
};

export const OnlyCLI: Story = {
  args: {
    name: 'Auto accept changes',
    option: '--auto-accept-changes',
    flag: '--auto-accept-changes',
    description:
      'If there are any changes to the build, automatically accept them. Only for given branch, if specified.',
    type: 'string',
    example: '<code>"my-folder/**"</code>',
    supports: ['CLI'],
  },
};

export const OnlyConfigFile: Story = {
  args: {
    name: 'Auto accept changes',
    option: 'autoAcceptChanges',
    description:
      'If there are any changes to the build, automatically accept them. Only for given branch, if specified.',
    type: 'string',
    example: '<code>"my-folder/**"</code>',
    supports: ['Config File'],
  },
};

export const OnlyCI: Story = {
  args: {
    name: 'Auto accept changes',
    option: 'autoAcceptChanges',
    flag: '--auto-accept-changes',
    description:
      'If there are any changes to the build, automatically accept them. Only for given branch, if specified.',
    type: 'string',
    example: '<code>"my-folder/**"</code>',
    supports: ['GitHub Action'],
  },
};

export const GitHubActionFlagOnly: Story = {
  args: {
    // A raw consumer without an option key: formatOption has not run, so
    // neither hasConfigKey nor anchorId is set — the Option row hides and the
    // anchor falls back to optionSlug(option).
    name: 'Flag only',
    flag: '--flag-only',
    description: 'A card backed only by a CLI flag, consumed directly without formatting.',
    type: 'string',
    example: '<code>"value"</code>',
    supports: ['CLI', 'GitHub Action'],
  },
};

export const PatchBuild: Story = {
  args: {
    // Mirrors the real --patch-build entry as formatOption emits it: a config
    // key with an explicit anchor override keeping the legacy #patch-build
    // deep link.
    name: 'Patch build',
    option: 'patchBuild',
    anchorId: 'patch-build',
    flag: '--patch-build',
    description: 'Create a patch build to fix a missing PR comparison.',
    type: 'string',
    example: '<code>"my-feature...main"</code>',
    supports: ['CLI', 'GitHub Action'],
  },
};

export const ListAvailableStories: Story = {
  args: {
    // Mirrors the real --list entry: CLI-only with no option key — flag only.
    name: 'List available stories',
    flag: '--list',
    description: 'Outputs the list of available stories in your Storybook.',
    type: 'boolean',
    example: '<code>true</code>',
    supports: ['CLI'],
  },
};
