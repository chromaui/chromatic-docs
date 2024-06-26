import {
  Button,
  fontWeight,
  Header,
  Link,
  spacing,
  typography,
} from "@chromaui/tetra";
import { styled } from "@storybook/theming";
import type { FC } from "react";

import { desktopData, mobileData } from "./headerData";

interface Props {
  theme?: "dark" | "light";
}

const MobileButtons = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${spacing[3]};
`;

const HeaderCTAButton = styled(Button)`
  height: ${spacing[8]};
  ${typography.body14};
  font-weight: ${fontWeight.bold};
`;

export const MarketingHeader: FC<Props> = ({ theme = "light" }) => {
  return (
    <Header
      desktopActiveId="docs"
      theme={theme}
      desktopData={desktopData}
      mobileData={mobileData}
      desktopRight={
        <>
          <Link
            size="md"
            weight="bold"
            color={theme === "dark" ? "white" : "blue500"}
            href="https://www.chromatic.com/start"
          >
            Sign in
          </Link>
          <HeaderCTAButton
            size="sm"
            variant="outline"
            color={theme === "dark" ? "white" : "blue"}
            href="https://www.chromatic.com/start?startWithSignup=true"
          >
            Sign up
          </HeaderCTAButton>
        </>
      }
      mobileBottom={
        <MobileButtons>
          <Button
            size="sm"
            variant="outline"
            color="blue"
            href="https://www.chromatic.com/start"
          >
            Sign in
          </Button>
          <Button
            size="sm"
            variant="solid"
            color="blue"
            href="https://www.chromatic.com/start?startWithSignup=true"
          >
            Sign up
          </Button>
        </MobileButtons>
      }
    />
  );
};
