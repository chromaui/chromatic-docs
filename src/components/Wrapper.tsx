import React from "react";
import type { FC } from "react";
import { MarketingHeader } from "./Header/MarketingHeader";
import { MarketingFooter } from "./Footer/MarketingFooter";

interface Props {
  children: React.ReactNode;
}

export const Wrapper: FC<Props> = ({ children }) => {
  return (
    <div>
      <MarketingHeader />
      {children}
      <MarketingFooter />
    </div>
  );
};
