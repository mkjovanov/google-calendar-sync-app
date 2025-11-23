module.exports = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  printWidth: 100,
  arrowParens: "always",
  bracketSpacing: true,
  endOfLine: "lf",

  // Plugins (optional)
  plugins: ["@trivago/prettier-plugin-sort-imports"],

  importOrder: [
    "^(react|react-dom)$",
    "<THIRD_PARTY_MODULES>",
    "^@server/(.*)$",
    "^@client/(.*)$",
    "^[./]",
  ],

  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
