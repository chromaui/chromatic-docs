import { css } from "@storybook/theming";

export const syntaxHighlighting = css`
  [data-remark-code-title] {
    margin-top: 2em;
    border-bottom: 1px solid rgba(0, 0, 0, 0.1);
    padding: 1rem;
    font-size: 14px;
    font-family: monospace;
    line-height: 1;
    background: #f8f8f8;
    color: #6a737d;
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    & + pre {
      margin-top: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }
  }

  div[class*="language-"] {
    margin: 1.5em 0;

    & + .aside {
      margin-top: -1.5rem;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  pre {
    padding: 1.5em;
    margin: 1.5em 0;

    code {
      display: inline-block;
    }

    & + .aside {
      margin-top: -1.5rem;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  pre.astro-code {
    background: #f8f8f8 !important;
    position: relative;
  }

  .astro-code code {
    min-width: 100%;
  }

  .astro-code code .diff {
    display: inline-block;
    width: calc(100% + 48px);
    padding: 0 24px;
    margin: 0 -24px;
    transition: background-color 0.5s;
  }

  .astro-code code .diff::before {
    position: absolute;
    left: 12px;
  }

  .astro-code code .diff.remove {
    background-color: #d73a4922;
    opacity: 0.7;
  }

  .astro-code code .diff.remove::before {
    color: #b31d28;
    content: "-";
    transform: translateX(-6px);
  }

  .astro-code code .diff.add {
    background-color: #34d05822;
  }

  .astro-code code .diff.add::before {
    color: #22863a;
    content: "+";
    transform: translateX(-6px);
  }

  .astro-code code .highlighted {
    z-index: 2;
    display: inline-block;
    width: calc(100% + 48px);
    padding: 0 24px;
    margin: 0 -24px;
    background-color: #d9e8f2;
    transition: background-color 0.5s;
  }

  /* Code combination with asides */
  code-snippet-tabs {
    pre {
      margin-top: 0;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
    }

    & + .aside {
      margin-top: -1.5rem;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  .callout:has(+ pre.astro-code) {
    margin-bottom: -1.5rem;
    border-bottom-left-radius: 0;
    border-bottom-right-radius: 0;
    border-bottom: none;
  }

  .callout + pre.astro-code {
    border-top-left-radius: 0;
    border-top-right-radius: 0;
    border: 1px solid rgba(2, 113, 182, 0.1);
  }
`;
