// @ts-check

/** @type {import("eslint").Linter.Config} */
const config = {
  root: true,
  extends: [
    "plugin:vue/vue3-essential",
    "eslint:recommended",
    "@vue/eslint-config-typescript/recommended",
    "@vue/eslint-config-prettier",
  ],
  ignorePatterns: ["!src/.vitepress/**/*", "*.js"],
  env: {
    node: true,
  },
};

module.exports = config;
