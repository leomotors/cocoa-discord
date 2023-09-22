// @ts-check

module.exports = require("@leomotors/config/prettier").withSortImports({
  importOrder: [
    "^[.]/stub",
    "^[.][.]/stub",
    "^vitest",
    "^discord[-.]",
    "^@discordjs",
    "^node:",
    "^[a-zA-Z]",
    "^[.][.]",
    "^[.]",
  ],
});
