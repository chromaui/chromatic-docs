import * as docsearchpkg from "@docsearch/react";
import { css, Global } from "@storybook/theming";
import { color, spacing } from "@chromaui/tetra";

const { DocSearch } = docsearchpkg;

const ALGOLIA_API_KEY = import.meta.env.PUBLIC_ALGOLIA_API_KEY;

const styles = css`
:root {
  --docsearch-primary-color: ${color.blue500};
  --docsearch-muted-color: ${color.slate600};
}

.DocSearch-Button {
  background: ${color.white};
  box-shadow: ${color.blackTr10} 0 0 0 1px inset;
  color: ${color.slate500};

  .font-s2;
  line-height: 16px;
  margin: 0;
  padding: 10px 14px;
  min-width: ${spacing[36]};
  max-width: ${spacing[48]};
  width: 100%;

  &:focus,
  &:focus:hover {
    background: ${color.white};
    box-shadow: ${color.blue500} 0 0 0 1px inset;
    color: ${color.slate500};
  }

  &:hover {
    background: ${color.white};
    box-shadow: ${color.blackTr10} 0 0 0 1px inset;
    color: ${color.slate500};
  }
}

.DocSearch-Button .DocSearch-Search-Icon {
  color: currentColor;
  height: 1em;
  margin-right: 8px;
  width: 1em;
}

.DocSearch-Button-Placeholder {
  font-size: 1em;
  padding: 0;
}

.DocSearch-Button-Keys {
  min-width: 0;
}


.DocSearch-Button-Keys,
.DocSearch-Button-Placeholder {
  display: initial;
}


// Using an id here to overcome specificity of global input styles
// These are the same styles as DocSearch defaults
#docsearch-input {
  appearance: none;
  background: transparent;
  border: 0;
  color: var(--docsearch-text-color);
  flex: 1;
  font: inherit;
  font-size: 1.2em;
  height: 100%;
  outline: none;
  padding: 0 0 0 8px;
  width: 80%;
}

.DocSearch-Button-Key,
.DocSearch-Commands-Key {
  align-items: center;
  background: rgba(0, 0, 0, 0.07);
  border-radius: 2px;
  box-shadow: none;
  color: #666er;
  display: inline-flex;
  font-family: inherit;
  font-size: 11px;
  height: 16px;
  justify-content: center;
  line-height: 17px;
  margin-right: 2px;
  min-width: 16px;
  padding: 0 2px;
  user-select: none;
  width: auto;
}

.DocSearch-Label {
  margin-left: 2px;
}
`;

export function Search() {
  return (
    <>
      <Global styles={styles} />
      <DocSearch
        appId="I751GHI6QM"
        indexName="chromatic"
        apiKey={ALGOLIA_API_KEY}
      />
    </>
  );
}
