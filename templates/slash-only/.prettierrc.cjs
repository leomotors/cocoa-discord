// @ts-check

/** @satisfies {import("@trivago/prettier-plugin-sort-imports").PrettierConfig} */
const config = {
    bracketSpacing: true,
    tabWidth: 2,
    useTabs: false,
    singleQuote: false,
    semi: true,
    printWidth: 80,
    plugins: ["@trivago/prettier-plugin-sort-imports"],
    importOrder: [
        "^dotenv",
        "^cocoa-discord-utils",
        "^discord.js",
        "^@discordjs",
        "^[a-zA-Z]",
        "^[.][.]",
        "^[.]",
    ],
    importOrderCaseInsensitive: true,
    importOrderSeparation: true,
    importOrderParserPlugins: ["typescript", "decorators-legacy"],
};

module.exports = config;
