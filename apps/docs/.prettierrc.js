// @ts-check

/** @type {import("prettier").Config & Record<string, unknown>} */
const config = {
  ...require("@cocoa-discord/config/prettier-web"),
  importOrder: ["^vitepress/theme", "^[.][/]styles", "^[$]"],
};

module.exports = config;
