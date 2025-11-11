// @ts-check

import { createESLintConfig } from "@leomotors/config";
import { defineConfig } from "eslint/config";

export default defineConfig([
  ...createESLintConfig(),
  {
    files: ["**/*.js"],
    rules: {
      "no-undef": "off",
    },
  },
  {
    ignores: ["**/*.g.ts"],
  },
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // TODO Turn these rules off
      "@typescript-eslint/no-namespace": "off",
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  },
  {
    files: ["**/*/tests/**/*"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-function": "off",
      "@typescript-eslint/ban-ts-comment": "off",
    },
  },
]);
