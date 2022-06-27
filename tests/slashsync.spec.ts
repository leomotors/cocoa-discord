import { describe, it, expect } from "vitest";

import { isSameOption } from "../src/slash";

describe("Slash Sync Utilities", () => {
    it("Is Same Option", () => {
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

        expect(isSameOption(o2, n2)).toBe(true);
        expect(isSameOption(o2, n3)).toBe(false);

        // TODO Check options order
    });
});
