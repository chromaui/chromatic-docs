/** @type {import("prettier").Config} */

const config = {
  plugins: ['prettier-plugin-astro'],
  printWidth: 100,
  tabWidth: 2,
  bracketSpacing: true,
  trailingComma: 'es5',
  singleQuote: true,
  jsxBracketSameLine: false,
};

module.exports = config;
