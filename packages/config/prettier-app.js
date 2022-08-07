// @ts-check

/** @type {import("prettier").Config & Record<string, unknown>} */
const config = {
    bracketSpacing: true,
    tabWidth: 4,
    useTabs: false,
    singleQuote: false,
    semi: true,
    printWidth: 80,
    importOrderCaseInsensitive: true,
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ["typescript", "decorators-legacy", "jsx"],
};

module.exports = config;
