import type { Meta, StoryObj } from '@storybook/react-vite';
import { ImportantCallout } from './ImportantCallout';

const meta = {
  title: 'Components/ImportantCallout',
  component: ImportantCallout,
  parameters: {
    // Fail the test on a11y violations, including text and link contrast
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof ImportantCallout>;

export default meta;
type Story = StoryObj<typeof ImportantCallout>;

export const Short: Story = {
  args: {
    children: (
      <p>
        Every captured snapshot incurs a billed snapshot, whether or not it shows a visual change.{' '}
        <a href="/docs/billing">Learn about billing</a>
      </p>
    ),
  },
};

export const Long: Story = {
  args: {
    children: (
      <>
        <p>
          TurboSnap looks at <strong>code changes</strong>, not <strong>visual changes</strong>. It
          decides which stories to capture <em>before</em> any snapshot is taken, so it can't know
          whether a story will end up looking different. Every story it captures incurs a full
          billed snapshot, whether or not that snapshot shows a visual change.
        </p>
        <p>
          TurboSnap is deliberately conservative: when a file change <em>could</em> affect a story,
          Chromatic captures it. <a href="/docs/turbosnap">Learn about TurboSnap</a>
        </p>
      </>
    ),
  },
};
