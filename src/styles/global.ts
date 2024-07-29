import { cssVariables } from "@chromatic-com/tetra";

export const globalStyles = /*css*/ `
  ${cssVariables}

  :root {
    --accent: 136, 58, 234;
    --accent-light: 224, 204, 250;
    --accent-dark: 49, 10, 101;
    --accent-gradient: linear-gradient(
      45deg,
      rgb(var(--accent)),
      rgb(var(--accent-light)) 30%,
      white 60%
    );
  }

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
    -webkit-tap-highlight-color: transparent; /* For some Androids */
  }

  html {
    outline: none;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  html,
  body {
    font-family: "Nunito Sans", "Helvetica Neue", Helvetica, Arial,
      sans-serif;
    background: #fff;
    margin: 0;
    padding: 0;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }
`;
