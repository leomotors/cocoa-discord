import { defineConfig } from "vitepress";

export default defineConfig({
    title: "Cocoa Discord Utils",
    description:
        "Documentation for Cocoa Discord Utils, Library to simplify creating discord bots",

    themeConfig: {
        footer: {
            message: "Released under the MIT License",
            copyright: "Copyright © 2021-2022 Leomotors",
        },
        socialLinks: [
            {
                icon: "github",
                link: "https://github.com/Leomotors/cocoa-discord-utils",
            },
        ],
        editLink: {
            pattern:
                "https://github.com/Leomotors/cocoa-discord-utils/edit/main/docs/:path",
            text: "Edit this page on GitHub",
        },

        sidebar: [
            {
                text: "Introduction",
                items: [
                    {
                        text: "Overview",
                        link: "/introduction/overview",
                    },
                ],
            },
            {
                text: "Configuration",
                items: [
                    {
                        text: "Using .cocoarc",
                        link: "/configuration/cocoarc",
                    },
                ],
            },
            {
                text: "Main",
                items: [
                    {
                        text: "Main Utilities",
                        link: "/main",
                    },
                ],
            },
            {
                text: "Command Management System",
                items: [
                    {
                        text: "Basic Concept",
                        link: "/cms",
                    },
                    {
                        text: "Event Handling",
                        link: "/cms_evt",
                    },
                ],
            },
        ],
    },

    outDir: "../docs-dist",
});
