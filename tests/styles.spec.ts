import { assert } from "chai";

import { createEmbedStyle } from "../src/main";

describe("Embed Style", () => {
    const style = createEmbedStyle({
        author: "invoker",
        color: 0x000000,
        footer: (_) => ({
            text: "Hello",
        }),
    });

    it("Has Correct Properties", () => {
        // @ts-ignore Private Props yeet
        assert.equal(style.style.author, "invoker");
        // @ts-ignore
        assert.isFunction(style.style.footer);
    });

    it("resolve() method works", () => {
        // @ts-ignore Private props yeet
        assert.equal(style.resolve({}, style.style.author), style.style.author);
        // @ts-ignore yeeett
        assert.deepEqual(style.resolve({}, style.style.footer), {
            text: "Hello",
        });
    });
});
