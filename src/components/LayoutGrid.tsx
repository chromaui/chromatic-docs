import { minLg, minMd, minXl, spacing } from "@chromatic-com/tetra";
import { css, styled } from "@storybook/theming";

export const LayoutGrid = styled.div<{ showOnThisPage?: boolean }>`
  margin: ${spacing[10]} 0;
  display: flex;
  gap: ${spacing[10]};
  flex-direction: column;

  ${minMd} {
    margin: ${spacing[16]} 0;
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: ${spacing[5]};
  }

  ${minLg} {
    grid-template-columns: 240px 1fr;
  }

  ${(props) =>
    props.showOnThisPage &&
    css`
      ${minXl} {
        .on-this-page {
          display: block;
        }

        grid-template-columns: 240px 1fr 300px;
      }
    `}
`;
