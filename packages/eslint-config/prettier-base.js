/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  singleQuote: true,
  trailingComma: 'all',
  tabWidth: 2,
  printWidth: 120,
  endOfLine: 'lf',
  semi: true,
  arrowParens: 'always',
  plugins: ['prettier-plugin-organize-imports', 'prettier-plugin-tailwindcss'],
};

export default config;
