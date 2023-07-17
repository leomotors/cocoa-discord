// @ts-check

/** @type {import("prettier").Config & Record<string, unknown>} */
const config = {
  ...require("@cocoa-discord-utils/config/prettier-app"),
  importOrder: ["^vitepress/theme", "^[.][/]styles", "^[$]"],
};

module.exports = config;
