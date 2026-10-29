import * as React from 'react';
import { Icon, color, fontWeight, spacing } from '@chromatic-com/tetra';
import styled from '@emotion/styled';

interface AICalloutProps {
  children: React.ReactNode;
}

// Same box shape as `.callout` in src/styles/formatting.ts, with the icon column
// layout from A11yBeta.astro, in the purple scale.
const Wrapper = styled.div`
  display: flex;
  align-items: stretch;
  font-size: 14px;
  line-height: 20px;
  color: ${color.slate700};
  background: ${color.purple50};
  border: 1px solid ${color.purple100};
  border-radius: 4px;
  margin-bottom: 1.5em;
  overflow: hidden;

  // .aside and .callout boxes have no bottom margin, so space the callout off
  // them. Only these, so the gap below headings and paragraphs stays the same.
  .aside + &,
  .callout + & {
    margin-top: 1.5em;
  }
`;

const IconColumn = styled.div`
  display: flex;
  flex: none;
  align-items: center;
  justify-content: center;
  padding: 0 ${spacing[4]};
  background: ${color.purple100};
  color: ${color.purple500};
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
  padding: ${spacing[4]};

  & > :first-of-type {
    margin-top: 0;
  }

  & > :last-of-type {
    margin-bottom: 0;
  }

  a {
    // require !important to override base link styles
    color: ${color.purple500} !important;
    font-weight: ${fontWeight.regular};
    // purple vs body text is under 3:1, so links need an underline (WCAG 1.4.1)
    text-decoration: underline;
  }
`;

export const AICallout = ({ children }: AICalloutProps) => (
  <Wrapper>
    <IconColumn>
      <Icon name="wand" aria-hidden="true" />
    </IconColumn>
    <Body>{children}</Body>
  </Wrapper>
);
