import { css } from "@storybook/theming";
import { minMd } from "@chromatic-com/tetra";

export const button = css`
  .btn {
    border: 0;
    display: inline-block;
    overflow: hidden;
    padding: 13px 20px;
    position: relative;
    text-align: center;
    text-decoration: none;
    vertical-align: top;
    white-space: nowrap;

    font-size: 14px;
    line-height: 20px;
    font-weight: 800;
    line-height: 1;

    // Pill shaped
    &.round {
      border-radius: 3em;
    }

    // Small buttons
    &.small {
      transition: all 250ms ease-out;
      font-size: 12px;
      line-height: 16px;
      padding: 8px 16px;
    }

    // Disabled
    &[disabled] {
      cursor: not-allowed;
    }

    &:hover,
    &:active {
      transition: all 150ms ease-out;
    }

    // Button colors
    &.primary {
      background-color: #1ea7fd;
      color: #fff !important;
      font-weight: 700 !important;

      &:hover {
        background-color: darken(#1ea7fd, 5%);
      }
      &:active {
        box-shadow: fade((darken(#1ea7fd, 50%)), 30%) 0 0px 0px 3em inset;
      }

      &[disabled],
      &[disabled]:hover,
      &[disabled]:active {
        background-color: lighten(#1ea7fd, 15%);
        box-shadow: none;
      }
    }

    &.secondary {
      background-color: #fc521f;
      color: #fff;

      &:hover {
        background-color: darken(#fc521f, 5%);
      }
      &:active {
        box-shadow: fade((darken(#fc521f, 50%)), 30%) 0 0px 0px 3em inset;
      }

      &[disabled],
      &[disabled]:hover,
      &[disabled]:active {
        background-color: lighten(#fc521f, 15%);
        box-shadow: none;
      }
    }

    &.tertiary {
      background-color: #dedede;
      color: #333;

      &:hover {
        background-color: #d1d1d1;
      }
      &:active {
        box-shadow: rgba(95, 95, 95, 0.3) 0 0px 0px 3em inset;
      }
      &[disabled],
      &[disabled]:hover,
      &[disabled]:active {
        background-color: #e8e8e8;
        box-shadow: none;
        color: #999;
      }
    }

    &.outline {
      box-shadow: #ccc 0 0 0 1px inset;
      color: #666;
      background: transparent;

      letter-spacing: 0;
      text-indent: 0;
      text-transform: none;

      &:hover {
        box-shadow: #999 0 0 0 1px inset;
        cursor: pointer;
      }

      &.active,
      &:active {
        background-color: #ccc;
        color: #333;
      }
    }

    &.inverse {
      box-shadow: fade(#fff, 30%) 0 0px 0px 1px inset;
      color: #fff;

      //remove caps
      letter-spacing: 0;
      text-indent: 0;
      text-transform: none;

      &:hover {
        box-shadow: fade(#fff, 20%) 0 0px 0px 1px inset;
      }
      &:active {
        box-shadow: fade(#fff, 10%) 0 0px 0px 3em inset;
      }
      &.active {
        color: #333;
        box-shadow: #fff 0 0px 0px 3em inset;
      }
    }

    &.selected {
      color: #666;
      padding-left: 1.5rem;
      padding-right: 1.5rem;

      &:after {
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        content: "";
        border: 1px dotted #999;
        display: block;
      }

      [class*="icon-"] {
        text-indent: 0;
        letter-spacing: 0;
        margin-left: -0.375rem;
      }
    }

    // Progress button
    // When a user has submitted a form and there is a finite amount wait time
    &.progress {
      height: auto;

      .rest,
      .active {
        transition: all 700ms cubic-bezier(0.175, 0.885, 0.335, 1.05);
      }

      .rest {
        transform: translate3d(0, 0, 0);
        display: inline-block;
        opacity: 1;
      }

      .active {
        position: absolute;
        top: 50%;
        right: 0;
        bottom: auto;
        left: 0;
        transform: translate3d(0, 100%, 0);
        opacity: 0;
      }

      &:before {
        position: absolute;
        top: auto;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        transition: all 150ms ease-out;
        transform: translateY(100%);
        //background-color: rgba(0,0,0,.2);
        content: "";
      }

      .progress-bar {
        position: absolute;
        top: auto;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        transition: all 150ms ease-out;
        transform: translateX(-100%);
        z-index: 1;
      }

      &.primary .progress-bar {
        background-color: darken(#1ea7fd, 10%);
      }
      &.secondary .progress-bar {
        background-color: darken(#fc521f, 10%);
      }
      &.tertiary .progress-bar {
        background-color: #1ea7fd;
      }

      &.progress-active {
        cursor: progress;

        .rest {
          transform: translate3d(0, -100%, 0);
          opacity: 0;
        }
        .active {
          transform: translate3d(0, -50%, 0);
          opacity: 1;
        }

        &:before {
          transform: translateY(0%);
        }
        .progress-bar {
          transform: translateX(0%);
        }
      }
    }

    // Loading button
    // When a user has submitted a form and there is an uncertain  wait time
    // e.g., calling third-party APIs
    &.loading {
      .rest,
      .active {
        transition: all 700ms cubic-bezier(0.175, 0.885, 0.335, 1.05);
      }

      .rest {
        transform: translate3d(0, 0, 0);
        display: inline-block;
        opacity: 1;
      }

      .active {
        position: absolute;
        top: 50%;
        right: 0;
        bottom: auto;
        left: 0;
        transform: translate3d(0, 100%, 0);
        opacity: 0;
      }

      &:before {
        position: absolute;
        top: auto;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 2px;
        transition: all 300ms ease-out;
        transform: translateX(100%);
        background: rgba(0, 0, 0, 0.2);
        opacity: 0;
        content: "";
      }

      .loading-bar {
        position: absolute;
        top: auto;
        right: 0;
        bottom: 0;
        left: 0;
        width: 33.3%;
        height: 2px;
        transition: all 200ms ease-out;
        opacity: 0;
        z-index: 1;
      }

      &.primary .loading-bar {
        background-color: lighten(#1ea7fd, 10%);
      }
      &.secondary .loading-bar {
        background-color: lighten(#fc521f, 10%);
      }
      &.tertiary .loading-bar {
        background-color: #1ea7fd;
      }

      &.loading-active {
        cursor: progress;

        .rest {
          transform: translate3d(0, -100%, 0);
          opacity: 0;
        }
        .active {
          transform: translate3d(0, -50%, 0);
          opacity: 1;
        }

        @keyframes loading-horiz {
          0%,
          100% {
            transform: translateX(-100%);
          }
          50% {
            transform: translateX(300%);
          }
        }

        &:before {
          transform: translateX(0%);
          opacity: 1;
        }

        .loading-bar {
          /* .animation(loading-horiz 2s ease-in-out);
        .animation-iteration-count(infinite); */
          opacity: 1;
        }
      }
    }

    &.paginated {
      background-color: #e6e6e6;
      color: #333;

      padding-left: 1rem;
      padding-right: 1rem;
      letter-spacing: 0;
      text-indent: 0;

      &:hover {
        background-color: #d9d9d9;
      }
      &:active {
        box-shadow: rgba(103, 103, 103, 0.3) 0 0px 0px 3em inset;
      }

      & + .btn {
        margin-left: 1px;
        background-color: #dedede;
        color: #333;

        &:hover {
          background-color: #bfbfbf;
        }
        &:active {
          box-shadow: rgba(77, 77, 77, 0.3) 0 0px 0px 3em inset;
        }
      }

      &[disabled],
      &[disabled]:hover,
      &[disabled]:active {
        background-color: #e8e8e8;
        box-shadow: none;
        color: #999;
      }

      .icon-arrow-right,
      .icon-arrow-left {
        font-size: 14px;
        line-height: 20px;
        line-height: 20px !important;
        display: inline-block;
        vertical-align: top;
      }
    }

    &.small.circle {
      padding-left: 0;
      padding-right: 0;
      text-align: center;
      width: 28px; //the size of small buttons
    }

    &.scale {
      background-color: transparent;
      padding: 0;
      width: 14px;

      [class*="icon-"]:only-child {
        display: block;
        font-size: 10px;
        line-height: 14px;
        letter-spacing: 0;
        text-indent: 0;
      }

      box-shadow: #1ea7fd 0 0 0 1px inset;
      color: #1ea7fd;

      letter-spacing: 0;
      text-indent: 0;
      text-transform: none;

      &.active,
      &:active {
        box-shadow: #1ea7fd 0 0 0 3em inset;
        color: #fff;
      }

      &.disabled {
        box-shadow: #ccc 0 0 0 1px inset;
        color: #ccc;
        cursor: not-allowed;
      }
    }

    [class*="icon-"] {
      font-size: 16px;
      margin-right: 6px;
      vertical-align: baseline;
      margin-top: -1px;
      margin-bottom: -1px;
      float: left;

      &:only-child {
        font-size: 14px;
        line-height: 20px;
        letter-spacing: 0;
        margin-right: 0;
        text-indent: 0;
        display: block;
      }
    }
  }

  .btn-group {
    display: inline-block;

    > .btn {
      float: left;
    }
    &.right > .btn {
      float: right;
    }

    &.full-bleed {
      display: flex;
      flex-direction: row-reverse;

      > .btn {
        flex: 1;
      }
    }
  }

  .pagination {
    .count {
      font-size: 12px;
      line-height: 16px;
      letter-spacing: 0.35em;
      text-transform: uppercase;
      font-weight: 800;
      display: inline-block;
      line-height: 40px;
      margin-left: 1rem;

      color: #444;

      .preposition {
        color: #999;
      }
    }
  }

  .btn-group.toggle .btn {
    & + .btn {
      margin-left: -1px;
    }
    &:first-of-type {
      border-radius: 3em 0 0 3em;
    }
    &:last-of-type {
      border-radius: 0 3em 3em 0;
    }
  }

  //This appears as a button but is actually a form element
  .btn-group.toggle-form {
    display: flex;

    > .btn.toggle-form {
      flex: 1;

      transition:
        box-shadow 225ms ease-out,
        background-color 300ms ease-in,
        color 300ms ease-out;
      font-size: 14px;
      line-height: 20px;
      background-color: fade(#fff, 50%);
      box-shadow: fade(#fff, 0%) 0 0 0 0 inset;
      color: #999;
      letter-spacing: 0;
      margin: 0;
      text-indent: 0;
      text-transform: none;

      &:not(:first-of-type) {
        margin-left: 1px;
      }
    }

    input.toggle-form {
      display: none;
    }

    input.toggle-form:checked + label {
      background-color: fade(#fff, 100%);
      box-shadow: fade(#fff, 70%) 0 0 0 3em inset;
      color: #1ea7fd;
    }
  }

  .btn-integration-group {
    display: flex;
    align-items: center;
    gap: 1rem;
    flex-wrap: wrap;
  }

  .btn-integration {
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    display: inline-block;
    overflow: hidden;
    padding: 1rem;
    text-align: center;
    text-decoration: none;

    font-size: 14px;
    line-height: 1;

    transition:
      background 150ms ease-out,
      border 150ms ease-out,
      transform 150ms ease-out;

    &:hover {
      border-color: #1ea7fd;
      transform: translate3d(0, -3px, 0);
      box-shadow: rgba(0, 0, 0, 0.08) 0 3px 10px 0;
    }

    &:active {
      border-color: #1ea7fd;
      transform: translate3d(0, 0, 0);
    }

    img {
      display: block;
      width: 32px;
      height: 32px;
      padding: 0;
    }

    ${minMd} {
      padding: 2rem;

      img {
        width: 64px;
        height: 64px;
      }
    }
  }
`;
