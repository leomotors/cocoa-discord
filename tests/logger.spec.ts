import { assert, expect } from "chai";

import { Cocoa, LogStatus } from "../src/main";

describe("[logger] Logger", () => {
    it("Normal", () => {
        const f = Cocoa.format("Hello World");

        assert.isTrue(f.startsWith("["));
        assert.isTrue(f.endsWith("World"));
    });

    it("Success should be Green", () => {
        const f = Cocoa.format("Hello World", LogStatus.Success);

        expect(f).to.match(/^\u001b\[32m/);
    });
});
