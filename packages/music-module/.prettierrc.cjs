// @ts-check

module.exports = require("@leomotors/config/prettier").withSortImports({
  importOrder: [
    "^dotenv",
    "^cocoa-discord-utils",
    "^discord.js",
    "^@discordjs",
    "^[a-zA-Z]",
    "^[.][.]",
    "^[.]",
  ],
});
