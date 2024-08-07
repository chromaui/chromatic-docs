import { styled } from "@storybook/theming";
import { button } from "../../styles/button";
import { formatting } from "../../styles/formatting";
import { syntaxHighlighting } from "../../styles/syntax-highlighting";
import { base } from "../../styles/base";
import { link } from "../../styles/link";

export const ContentContainer = styled.main`
  min-width: 0;
  font-size: 16px;
  line-height: 28px;

  ${base}
  ${button}
  ${formatting}
  ${syntaxHighlighting}
  ${link}
`;
