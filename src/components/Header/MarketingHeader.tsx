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
      theme={theme}
      logoHeightDesktop={24}
      logoHeightMobile={22}
      desktopData={desktopData}
      mobileData={mobileData}
      desktopBreakpoint={1000}
      desktopRight={
        <>
          coucou
          <Link
            size="md"
            weight="semibold"
            color={theme === "dark" ? "white" : "blue500"}
          >
            Sign in
          </Link>
          <HeaderCTAButton
            size="sm"
            variant="outline"
            color={theme === "dark" ? "white" : "blue"}
          >
            Sign up
          </HeaderCTAButton>
        </>
      }
      mobileBottom={
        <MobileButtons>
          <Button size="sm" variant="outline" color="blue">
            Sign in
          </Button>
          <Button size="sm" variant="solid" color="blue">
            Sign up
          </Button>
        </MobileButtons>
      }
    />
  );
};
