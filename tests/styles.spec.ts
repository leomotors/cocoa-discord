import { assert } from "chai";

import { EmbedStyle } from "../src/main";

describe("[styles] Embed Style", () => {
    const style = new EmbedStyle({
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
