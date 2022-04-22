import { assert } from "chai";

import { CocoaEmbed } from "../src/main";

describe("[embed] CocoaEmbed Test", () => {
    it("Can Initialize and use addField & addInlineField", () => {
        const emb = new CocoaEmbed();

        emb.addFields([{ name: "Hi", value: "LOL" }]);
        emb.addInlineFields({ name: "Hi2", value: "BRUH" });
        emb.addInlineFields(
            { name: "Hi3", value: "Value3" },
            { name: "Hi4", value: "Value4" }
        );

        assert.equal(emb.data.fields![0]?.name, "Hi");
        assert.equal(emb.data.fields![1]?.name, "Hi2");
        assert.isNotTrue(emb.data.fields![0]?.inline);
        assert.isTrue(emb.data.fields![1]?.inline);
        assert.isTrue(emb.data.fields![2]?.inline);
        assert.isTrue(emb.data.fields![3]?.inline);
    });
});
