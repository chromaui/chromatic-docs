import type { Meta, StoryObj } from '@storybook/react-vite';
import { AICallout } from './AICallout';

const meta = {
  title: 'Components/AICallout',
  component: AICallout,
  parameters: {
    // Fail the test on a11y violations, including text and link contrast
    a11y: { test: 'error' },
  },
} satisfies Meta<typeof AICallout>;

export default meta;
type Story = StoryObj<typeof AICallout>;

export const Short: Story = {
  args: {
    children: (
      <p>
        Ask your agent to run <code>npx chromatic</code> and review the results with the{' '}
        <a href="/docs/mcp">Chromatic MCP server</a>.
      </p>
    ),
  },
};

export const Long: Story = {
  args: {
    children: (
      <p>
        Connect your coding agent to Chromatic so it can read build results, find the stories that
        changed, and explain why a snapshot looks different. Agents can fetch the latest build for a
        branch, list visual changes waiting for review, and summarize accessibility violations
        before you open the pull request. Set up the <a href="/docs/mcp">Chromatic MCP server</a>{' '}
        once and every agent session in this repository can use it.
      </p>
    ),
  },
};
