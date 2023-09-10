import { styled } from "@storybook/theming";
import { Support } from "../Support";
import { minMd, spacing } from "@chromaui/tetra";

export const Container = styled.div`
  display: flex;
  gap: ${spacing[4]};
  align-items: center;

  ${minMd} {
    gap: ${spacing[6]};
    align-items: flex-start;
    flex-direction: column;
    width: 240px;
    flex-shrink: 0;
  }
`;

export const SupportButton = styled(Support)`
  display: none;

  ${minMd} {
    display: block;
  }
`;
