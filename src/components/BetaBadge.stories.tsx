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

// Matches the docs H1 (src/styles/formatting.ts) to check size and alignment.
export const InTitle: Story = {
  render: () => (
    <h1
      style={{
        display: 'flex',
        alignItems: 'baseline',
        gap: '0.5rem',
        flexWrap: 'wrap',
        fontSize: 32,
        lineHeight: '36px',
        fontWeight: 700,
      }}
    >
      Chromatic for agents
      <BetaBadge />
    </h1>
  ),
};
