import * as React from 'react';
import { color, fontSize, fontWeight, lineHeight, spacing } from '@chromatic-com/tetra';
import styled from '@emotion/styled';

// Headings are normally flex rows, but a title with a badge switches to block
// layout (src/styles/formatting.ts), so the pill flows inline like a word: it
// follows the last word of a wrapping title and only moves to the next line
// on its own when that line is full.
const Pill = styled.span`
  display: inline-flex;
  vertical-align: middle;
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
 * A small "Beta" pill for page titles. Write it with no space before it:
 * `# Page title<BetaBadge />`. A space in the Markdown would end up in the
 * heading slug (`page-title-`), so the badge renders its own leading space.
 * That space is the gap between the title and the pill, and screen readers
 * and copied text get "Page title Beta".
 *
 * `data-llms-exclude` keeps it out of llms.txt and Copy markdown, so the
 * exported title still matches the frontmatter title.
 */
export const BetaBadge = () => (
  <>
    {' '}
    <Pill data-beta-badge="" data-llms-exclude="">
      Beta
    </Pill>
  </>
);
