import { minMd } from "@chromaui/tetra";
import { styled } from "@storybook/theming";

export const MainWrapper = styled.div`
  margin: 64px 0;
  display: flex;
  gap: 2.5rem;
  flex-direction: column;

  ${minMd} {
    flex-direction: row;
  }
`;
