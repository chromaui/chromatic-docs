import type { Meta, StoryObj } from "@storybook/react-vite";
import { LayoutGrid } from "./LayoutGrid";
import styled from "@emotion/styled";

const Navigation = styled.div`
  background: var(--tetra-color-blue100);
  height: 400px;
  padding: 16px;
`;

const Content = styled.div`
  background: var(--tetra-color-purple100);
  height: 400px;
  padding: 16px;
`;

const OnThisPage = styled.div`
  display: none;
  background: var(--tetra-color-yellow100);
  height: 400px;
  padding: 16px;
`;

const meta = {
  title: "Components/LayoutGrid",
  component: LayoutGrid,
  parameters: {
    layout: "fullscreen",
    chromatic: {
      viewports: [600, 900, 1200],
    },
  },
  render: ({ showOnThisPage }) => (
    <LayoutGrid showOnThisPage={showOnThisPage}>
      <Navigation>Navigation</Navigation>
      <Content>Content</Content>
      {showOnThisPage && (
        <OnThisPage className="on-this-page">On this page</OnThisPage>
      )}
    </LayoutGrid>
  ),
} satisfies Meta<typeof LayoutGrid>;

export default meta;
type Story = StoryObj<typeof LayoutGrid>;

export const Default: Story = {};

export const WithOnThisPage: Story = {
  args: {
    showOnThisPage: true,
  },
};
