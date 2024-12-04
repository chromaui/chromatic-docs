import { Footer } from "@chromatic-com/tetra";

interface MarketingFooterProps {
  theme?: "dark" | "light";
}

export const MarketingFooter = ({ theme = "light" }: MarketingFooterProps) => (
  <Footer theme={theme} LinkWrapper={undefined as any} />
);
