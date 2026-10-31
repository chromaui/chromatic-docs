import type { Meta, StoryObj } from '@storybook/react-vite';
import { BetaBadge } from './BetaBadge';

const meta = {
  title: 'Components/BetaBadge',
  component: BetaBadge,
  parameters: {
    // Fail the test on a11y violations, including text contrast
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof BetaBadge>;

export default meta;
type Story = StoryObj<typeof BetaBadge>;

export const Default: Story = {};

// Matches a docs H1 with a badge (src/styles/formatting.ts) to check size and
// alignment. The narrow width makes the title wrap.
export const InTitle: Story = {
  render: () => (
    <h1
      style={{
        display: 'block',
        maxWidth: 320,
        fontSize: 32,
        lineHeight: '36px',
        fontWeight: 700,
      }}
    >
      Run Chromatic with cloud agents
      <BetaBadge />
    </h1>
  ),
};
