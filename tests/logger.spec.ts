import { describe, it, expect } from "vitest";

import { Cocoa, LogStatus } from "../src/main";

describe("[logger] Logger", () => {
    it("Normal", () => {
        const f = Cocoa.format("Hello World");

        expect(f).toMatch(/^\[/);
        expect(f).toMatch(/World$/);
    });

    if (!process.env.IGNORE_COLOR) {
        it("Success should be Green", () => {
            const f = Cocoa.format("Hello World", LogStatus.Success);

            expect(f).toMatch(/^\u001b\[32m/);
        });
    }
});
