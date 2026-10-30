import * as React from 'react';
import { color, fontSize, fontWeight, lineHeight, spacing } from '@chromatic-com/tetra';
import styled from '@emotion/styled';

// Headings are flex rows with a gap (src/styles/formatting.ts), so the badge
// sits after the title text without its own margin and drops to the next line
// as a whole on narrow screens.
const Pill = styled.span`
  display: inline-flex;
  flex: none;
  align-self: center;
  align-items: center;
  padding: 0 ${spacing[2]};
  border-radius: 999px;
  background: ${color.purple100};
  color: ${color.purple500};
  font-size: ${fontSize[12]};
  font-weight: ${fontWeight.bold};
  line-height: ${lineHeight[20]};
  letter-spacing: 0.02em;
  white-space: nowrap;
`;

/**
 * A small "Beta" pill for page titles: `# Page title <BetaBadge />`.
 *
 * `data-llms-exclude` keeps it out of llms.txt and Copy markdown, so the
 * exported title still matches the frontmatter title. Screen readers read it.
 */
export const BetaBadge = () => <Pill data-llms-exclude="">Beta</Pill>;
