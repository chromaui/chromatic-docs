import { Footer } from '@chromaui/tetra';

import { footerColumns, footerSocialLinks, homeLink } from './footerData';

interface MarketingFooterProps {
  theme?: 'dark' | 'light';
}

export const MarketingFooter = ({ theme = 'light' }: MarketingFooterProps) => (
  <Footer
    theme={theme}
    columns={footerColumns}
    socialLinks={footerSocialLinks}
    homeLink={homeLink}
  />
);
