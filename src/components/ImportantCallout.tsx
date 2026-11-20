import * as React from 'react';
import { Icon, color, fontWeight, spacing } from '@chromatic-com/tetra';
import styled from '@emotion/styled';

interface ImportantCalloutProps {
  children: React.ReactNode;
}

// For crucial information readers commonly get wrong, such as billing or
// behavior that differs from what they'd expect. Use sparingly: a plain
// `.aside` is enough for supporting detail.
// Same layout as AICallout, in the yellow scale.
const Wrapper = styled.div`
  display: flex;
  align-items: stretch;
  font-size: 14px;
  line-height: 20px;
  color: ${color.slate800};
  background: ${color.yellow50};
  border: 1px solid ${color.yellow200};
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
  background: ${color.yellow100};
  color: ${color.orange600};
`;

const Body = styled.div`
  flex: 1;
  min-width: 0;
  padding: ${spacing[4]};

  & > :first-child {
    margin-top: 0;
  }

  // Global paragraph margins are sized for page flow; tighten them in the box.
  // && raises specificity above the global content p rule.
  && > * {
    margin-bottom: 0;
  }

  && > * + * {
    margin-top: ${spacing[3]};
  }

  a {
    // require !important to override base link styles
    color: inherit !important;
    font-weight: ${fontWeight.bold};
    // links share the body text color, so they need an underline (WCAG 1.4.1)
    text-decoration: underline;
  }
`;

export const ImportantCallout = ({ children }: ImportantCalloutProps) => (
  <Wrapper role="note" aria-label="Important">
    <IconColumn>
      <Icon name="alert" aria-hidden="true" />
    </IconColumn>
    <Body>{children}</Body>
  </Wrapper>
);
