import React from "react";
import type { FC } from "react";
import { styled } from "@storybook/theming";
import { button } from "../../styles/button";
import { formatting } from "../../styles/formatting";
import { base } from "../../styles/base";
import { link } from "../../styles/link";

interface Props {
  children: React.ReactNode;
}

const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;
  font-size: 16px;
  line-height: 28px;

  ${base}
  ${button}
  ${formatting}
  ${link}
`;

export const Wrapper: FC<Props> = ({ children }) => {
  return <Content>{children}</Content>;
};
