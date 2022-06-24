import { defineConfig } from "vitepress";

export default defineConfig({
    title: "Cocoa Discord Utils",
    description:
        "Documentation for Cocoa Discord Utils, Library to simplify creating discord bots",
    lastUpdated: true,
    base: "/cocoa-discord-utils",

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
                collapsible: true,
                text: "Introduction",
                items: [
                    {
                        text: "Overview",
                        link: "/introduction/overview",
                    },
                    {
                        text: "Examples",
                        link: "/introduction/examples",
                    },
                    {
                        text: "TypeDoc",
                        link: "/typedoc",
                    },
                ],
            },
            {
                collapsible: true,
                text: "Configuration",
                items: [
                    {
                        text: "Using .cocoarc",
                        link: "/configuration/cocoarc",
                    },
                ],
            },
            {
                collapsible: true,
                text: "Modules",
                items: [
                    {
                        text: "Main",
                        link: "/modules/main",
                    },
                ],
            },
            {
                collapsible: true,
                text: "Command Management System",
                items: [
                    {
                        text: "Basic Concept",
                        link: "/cms/basic",
                    },
                    {
                        text: "Advanced Decorator Syntax",
                        link: "/cms/decorator",
                    },
                    {
                        text: "Message Commands",
                        link: "/cms/message",
                    },
                    {
                        text: "Other Utilities",
                        link: "/cms/other",
                    },

                    {
                        text: "Event Handling",
                        link: "/cms/event",
                    },
                ],
            },
        ],
    },

    outDir: "../docs-dist",
});
