// @ts-check

const base = require("@leomotors/config/eslint").config();

/** @satisfies {import("eslint").Linter.Config} */
const config = {
  ...base,
  overrides: [
    ...base.overrides,
    {
      files: "./tests/**/*",
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/ban-ts-comment": "off",
      },
    },
  ],
};

module.exports = config;
