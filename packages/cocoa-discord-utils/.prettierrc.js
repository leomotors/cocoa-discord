// @ts-check

/** @type {import("prettier").Config & Record<string, unknown>} */
const config = {
    ...require("@cocoa-discord-utils/config/prettier-app"),
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
};

module.exports = config;
