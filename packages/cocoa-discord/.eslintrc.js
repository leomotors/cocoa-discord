// @ts-check

/** @type {import("eslint").Linter.Config} */
const config = {
    ...require("@cocoa-discord/config/eslint-app"),
    overrides: [
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
