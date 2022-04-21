import { assert } from "chai";

import { CocoaEmbed } from "../src/main";

describe("[embed] CocoaEmbed Test", () => {
    it("Can Initialize and use addField & addInlineField", () => {
        const emb = new CocoaEmbed();

        emb.addField({ name: "Hi", value: "LOL" });
        emb.addInlineField({ name: "Hi2", value: "BRUH" });
        emb.addInlineFields(
            { name: "Hi3", value: "Value3" },
            { name: "Hi4", value: "Value4" }
        );

        assert.equal(emb.fields[0]?.name, "Hi");
        assert.equal(emb.fields[1]?.name, "Hi2");
        assert.isNotTrue(emb.fields[0]?.inline);
        assert.isTrue(emb.fields[1]?.inline);
        assert.isTrue(emb.fields[2]?.inline);
        assert.isTrue(emb.fields[3]?.inline);
    });
});
