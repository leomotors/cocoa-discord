// @ts-check

module.exports = require("@leomotors/config/prettier").withSortImports({
  importOrder: [
    "^[.]/stub",
    "^[.][.]/stub",
    "^vitest",
    "^discord[-.]",
    "^@discordjs",
    "^[a-zA-Z]",
    "^[.][.]",
    "^[.]",
  ],
});
