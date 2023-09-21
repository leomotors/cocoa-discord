// @ts-check

const base = require("@leomotors/config/eslint").config();

/** @satisfies {import("eslint").Linter.Config} */
const config = {
  ...base,
  overrides: [
    ...base.overrides,
    {
      files: ["*.ts", "*.tsx"],
      rules: {
        // TODO Turn these rules off
        "@typescript-eslint/no-namespace": "off",
        "@typescript-eslint/no-non-null-assertion": "off",
      },
    },
    {
      files: "**/*/tests/**/*",
      rules: {
        "@typescript-eslint/no-unused-vars": "off",
        "@typescript-eslint/no-empty-function": "off",
        "@typescript-eslint/ban-ts-comment": "off",
      },
    },
  ],
};

module.exports = config;
