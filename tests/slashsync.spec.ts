import { describe, it, expect } from "vitest";

import { ApplicationCommandOptionType } from "discord.js";

import { isSameOption } from "../src/slash";

describe("Slash Sync Utilities", () => {
    it("Is Same Option: Single Option", () => {
        expect(isSameOption([], [])).toBe(true);

        const oldOpt = [
            {
                type: 4,
                name: "index",
                nameLocalizations: undefined,
                nameLocalized: undefined,
                description: "Index of removal",
                descriptionLocalizations: undefined,
                descriptionLocalized: undefined,
                required: true,
                autocomplete: undefined,
                choices: undefined,
                options: undefined,
                channelTypes: undefined,
                minValue: undefined,
                maxValue: undefined,
            },
        ];

        const newOpt = [
            {
                type: 4,
                name: "index",
                description: "Index of removal",
                required: true,
                autocomplete: false,
            },
        ];

        expect(isSameOption(oldOpt, newOpt)).toBe(true);

        newOpt[0].required = false;
        expect(isSameOption(oldOpt, newOpt)).toBe(false);

        const o2 = [
            {
                name: "a",
                description: "a",
                type: 69,
                choices: [{ name: "e", value: "e" }],
            },
        ];
        const n2 = [
            {
                name: "a",
                description: "a",
                type: 69,
                choices: [{ name: "e", value: "e" }],
            },
        ];
        const n3 = [
            {
                name: "a",
                description: "a",
                type: 69,
                choices: [{ name: "e", value: "f" }],
            },
        ];
        const n4 = [
            {
                name: "a",
                description: "a",
                type: 69,
                choices: [{ name: "f", value: "e" }],
            },
        ];

        expect(isSameOption(o2, n2)).toBe(true);
        expect(isSameOption(o2, n3)).toBe(false);
        expect(isSameOption(n3, n4)).toBe(false);
    });

    it("Is same Option: Multi Options", () => {
        const mo1 = [
            {
                type: ApplicationCommandOptionType.String,
                name: "frame",
                description: "Frame Name",
                required: true,
                choices: [
                    {
                        name: "vladdy_daddy.jpg",
                        value: "vladdy_daddy.jpg",
                    },
                    {
                        name: "big_frame.jpg",
                        value: "big_frame.jpg",
                    },
                    {
                        name: "golden_frame.png",
                        value: "golden_frame.png",
                    },
                    {
                        name: "wessuwan.png",
                        value: "wessuwan.png",
                    },
                    {
                        name: "obamium_portrait.jpg",
                        value: "obamium_portrait.jpg",
                    },
                ],
            },
            {
                type: ApplicationCommandOptionType.User,
                name: "who",
                description: "Who to put in the golden frame",
                required: false,
            },
            {
                type: ApplicationCommandOptionType.Attachment,
                name: "img",
                description: "Image to put in the frame",
                required: false,
            },
        ];

        const mn1 = [
            {
                choices: [
                    {
                        name: "vladdy_daddy.jpg",
                        value: "vladdy_daddy.jpg",
                    },
                    {
                        name: "big_frame.jpg",
                        value: "big_frame.jpg",
                    },
                    {
                        name: "golden_frame.png",
                        value: "golden_frame.png",
                    },
                    {
                        name: "wessuwan.png",
                        value: "wessuwan.png",
                    },
                    {
                        name: "obamium_portrait.jpg",
                        value: "obamium_portrait.jpg",
                    },
                ],
                type: ApplicationCommandOptionType.String,
                name: "frame",
                description: "Frame Name",
                required: true,
            },
            {
                name: "who",
                description: "Who to put in the golden frame",
                required: false,
                type: ApplicationCommandOptionType.User,
            },
            {
                name: "img",
                description: "Image to put in the frame",
                required: false,
                type: ApplicationCommandOptionType.Attachment,
            },
        ];

        expect(isSameOption(mo1, mn1)).toBe(true);

        // * Shuffle Order
        mn1[0].choices = [
            {
                name: "big_frame.jpg",
                value: "big_frame.jpg",
            },
            {
                name: "vladdy_daddy.jpg",
                value: "vladdy_daddy.jpg",
            },

            {
                name: "golden_frame.png",
                value: "golden_frame.png",
            },
            {
                name: "wessuwan.png",
                value: "wessuwan.png",
            },
            {
                name: "obamium_portrait.jpg",
                value: "obamium_portrait.jpg",
            },
        ];

        expect(isSameOption(mo1, mn1)).toBe(false);
    });
});
