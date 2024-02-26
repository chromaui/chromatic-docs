import { css } from "@storybook/theming";

export const formatting = css`
  font-size: 16px;
  line-height: 24px;
  line-height: 28px;

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    line-height: 1em;

    & + * {
      margin-top: 0 !important;
    }
  }

  h2:not(:first-child) {
    margin-top: 2.5rem;
  }

  hr {
    margin: 3em 0;
  }

  h1 {
    font-size: 32px;
    line-height: 1;
    font-weight: 700;
    line-height: 36px;
    margin-bottom: 1.5rem;
  }

  h2 {
    font-size: 24px;
    line-height: 1;
    font-weight: 700;
    line-height: 32px;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 20px;
    line-height: 1;
    font-weight: 700;
    line-height: 28px;
    margin: 2.5rem 0 0.5rem;
  }

  h4 {
    font-size: 16px;
    font-weight: 700;
    margin: 1.5rem 0 0.25rem;
  }

  h5 {
    line-height: 24px;
    font-weight: 700;
    color: #666;
    margin: 2rem 0 0.25rem;
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    display: flex;
    align-items: center;
    gap: 0.5rem;

    a.autolink-header {
      width: 14px;
      height: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: opacity 0.2s ease-in-out;
      opacity: 0;
    }

    .visually-hidden {
      border: 0;
      clip: rect(0 0 0 0);
      height: auto;
      margin: 0;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
      white-space: nowrap;
    }

    &:hover {
      a.autolink-header {
        opacity: 1;
      }
    }
  }

  h1 a.autolink-header {
    display: none;
  }

  p {
    margin: 1.5em 0;
    position: relative;

    &:first-of-type:not(:only-of-type) {
      margin-top: 0;
    }
    &:only-of-type {
      margin: 0;
    }
  }

  p a,
  li a {
    color: #026fb3;
    color: #026fb3;
    &:link,
    &:visited {
      color: #026fb3;
    }
    &:active {
      color: #025f9a;
    }
    font-weight: 400;
  }

  figure {
    clear: both;
    margin: 1em 0;

    figcaption {
      font-size: 12px;
      line-height: 16px;
      color: #999;
    }
  }

  img {
    display: inline-block;
    padding: 1rem;
    max-width: 100%;
    position: relative;
    vertical-align: top;
    height: auto;

    &.alignright {
      float: right;
      margin-right: 0;
    }

    &.alignleft {
      float: left;
      margin-left: 0;
    }

    &.aligncenter {
      display: block;
      margin-bottom: 1em;
      margin-left: auto;
      margin-right: auto;
      margin-top: 1em;
    }
  }

  blockquote {
    border-left: 2px solid #1ea7fd;
    color: #666;
    margin: 1em 0;
    padding: 0.75em 20px 0.75em 30px;

    p:only-of-type {
      margin: 0;
    }
  }

  ol,
  ul {
    list-style-position: outside;
    margin-bottom: 1.5em;
    margin-top: 1.5em;
    padding-left: 30px;

    li {
      margin-bottom: 0.5rem;
    }
  }

  ol {
    list-style-type: decimal;
  }
  ul {
    list-style-type: disc;
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

  code-snippet-tabs {
    pre {
      margin-top: 0;
    }

    & + .aside {
      margin-top: -1.5rem;
      border-top-left-radius: 0;
      border-top-right-radius: 0;
      border-top: 1px solid rgba(0, 0, 0, 0.1);
    }
  }

  .table-scroll {
    overflow: auto;
    table {
      table-layout: auto;
    }
  }

  dl {
    padding-left: 30px;
    margin: 0;

    &:not(:last-of-type) {
      margin-bottom: 1em;
      margin-top: 1em;
    }

    dt {
      font-weight: 700;

      &:not(:first-child) {
        margin-top: 1em;
      }

      code {
        line-height: inherit;
      }
    }

    dd {
      margin: 0;
    }
  }

  /* Tables based on GH markdown format */
  table {
    font-size: 14px;
    line-height: 20px;
    padding: 0;
    border-collapse: collapse;
    width: 100%;
    margin: 2rem 0;
    table-layout: fixed;
    overflow: hidden;

    a {
      // require !important to override base styles
      color: #026fb3 !important;
    }

    code {
      word-wrap: break-word;
      max-width: 100%;
    }
  }
  table tr {
    border-top: 1px solid #eee;
    background-color: white;
    margin: 0;
    padding: 0;
  }
  table tr:nth-child(2n) {
    background-color: #f8f8f8;
  }
  table tr th {
    font-weight: bold;
    border: 1px solid #ccc;
    border-radius: 3px 3px 0 0;
    text-align: left;
    margin: 0;
    padding: 0.5rem 0.75rem;
  }
  table tr td {
    border: 1px solid #ddd;
    text-align: left;
    margin: 0;
    padding: 0.5rem 1rem;
  }

  table tr th :first-child,
  table tr td:first-child {
    margin-top: 0;
  }

  table tr th :last-child,
  table tr td:last-child {
    margin-bottom: 0;
  }

  .aside {
    font-size: 14px;
    line-height: 20px;
    background: #f6f9fc;
    color: #444;
    border-radius: 4px;
    padding: 1em;
  }

  .aside a {
    color: #1ea7fd !important;
    font-weight: 400;
  }

  video {
    max-width: 100%;
  }

  details {
    margin: 1.5em 0;

    h1,
    h2,
    h3,
    h4 {
      display: inline;
    }

    &:not([open]) + details {
      margin-top: -1em;
    }
  }

  details > summary {
    display: list-item;
    cursor: pointer;
    color: #026fb3;
  }

  details[open] {
    position: relative;

    &:before {
      border-left: 1px solid rgba(0, 0, 0, 0.1);
      content: "";
      height: 100%;
      left: 4px;
      position: absolute;
      top: calc(28px + 1em);
      height: calc(100% - 2.4rem);
    }

    > summary {
      margin-bottom: 1em;
    }
    > summary ~ * {
      margin-left: 30px;
    }
  }

  details > summary::-webkit-details-marker {
    height: 10px;
    width: 10px;
  }

  details > video,
  details > img {
    max-width: calc(100% - 30px);
  }
`;
