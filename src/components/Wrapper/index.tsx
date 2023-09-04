import React from "react";
import type { FC } from "react";
import { MarketingHeader } from "../Header/MarketingHeader";
import { MarketingFooter } from "../Footer/MarketingFooter";
import { Container } from "@chromaui/tetra";
import { Sidebar } from "../Sidebar";
import { styled } from "@storybook/theming";

interface Props {
  children: React.ReactNode;
  url?: string;
}

const ContentWrapper = styled.div`
  display: flex;
  gap: 2.5rem;
  margin: 2.5rem 0;
`;

const Content = styled.div`
  flex-grow: 1;
  flex-shrink: 1;

  img {
    width: 100%;
    height: auto;
  }

  h1 {
    margin: 0 0 24px 0;
  }
`;

export const Wrapper: FC<Props> = ({ children, url }) => {
  return (
    <>
      <MarketingHeader />
      <Container>
        <ContentWrapper>
          <Sidebar url={url} />
          <Content>{children}</Content>
        </ContentWrapper>
      </Container>
      <MarketingFooter />
    </>
  );
};
