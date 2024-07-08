import { css } from "@storybook/theming";

export const link = css`
  a,
  .link {
    text-decoration: none;

    &:hover {
      cursor: pointer;
    }

    &:focus {
      outline: none;
    } //hides outline in FF

    &:link,
    &:visited {
      color: #444;
    }
  }

  .link {
    display: inline-block;

    &.primary {
      color: #1ea7fd;
      &:link,
      &:visited {
        color: #1ea7fd;
      }
      &:active {
        color: #059dfd;
      }
    }
    &.secondary {
      color: #fc521f;
      &:link,
      &:visited {
        color: #fc521f;
      }
      &:active {
        color: #fc3f06;
      }
    }
    &.tertiary {
      color: #666;
      &:link,
      &:visited {
        color: #666;
      }
      &:active {
        color: #595959;
      }
    }

    //When a link is on a dark background
    &.inverse {
      color: #fff;
      &:link,
      &:visited {
        color: #fff;
      }
      &:hover {
        color: #f8f8f8;
      }
      &:active {
        color: #ccc;
      }
    }

    &.inverse-alt {
      color: fade(#fff, 70%);
      &:link,
      &:visited {
        color: fade(#fff, 70%);
      }
      &:hover {
        color: fade(#fff, 100%);
      }
      &:active {
        color: #ccc;
      }
    }

    > [class*="icon-"] {
      font-size: 80%;
      display: inline-block;
      margin-right: 0.25em;
      vertical-align: baseline;
    }
  }
`;
