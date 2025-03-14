import { Header } from "@chromatic-com/tetra";
import type { FC } from "react";

import { links } from "./headerData";
import { styled } from "@storybook/theming";

interface Props {
  theme?: "dark" | "light";
}

const Wrapper = styled.span`
  display: contents;
`;

// Used for tracking sign up links and log which page the conversion happened
export const TrackSignUp = ({ children }: { children: React.ReactNode }) => {
  return (
    <Wrapper
      onClick={() => {
        if (window.plausible) {
          window.plausible("Click Sign Up");
        }
      }}
    >
      {children}
    </Wrapper>
  );
};

export const MarketingHeader: FC<Props> = ({ theme = "light" }) => {
  return (
    <Header
      fullWidth
      desktopActiveId="docs"
      theme={theme}
      links={links}
      TrackSignUp={TrackSignUp}
    />
  );
};
