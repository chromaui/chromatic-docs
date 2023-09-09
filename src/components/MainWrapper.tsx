import { minMd, spacing } from "@chromaui/tetra";
import { styled } from "@storybook/theming";

export const MainWrapper = styled.div`
  margin: ${spacing[10]} 0;
  display: flex;
  gap: ${spacing[10]};
  flex-direction: column;

  ${minMd} {
    margin: ${spacing[16]} 0;
    gap: ${spacing[5]};
    flex-direction: row;
  }
`;
