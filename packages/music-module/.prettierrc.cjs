// @ts-check

module.exports = require("@leomotors/config/prettier").withSortImports({
  importOrder: [
    "^dotenv",
    "^cocoa-discord",
    "^discord.js",
    "^@discordjs",
    "^node:",
    "^[a-zA-Z]",
    "^[.][.]",
    "^[.]",
  ],
});
