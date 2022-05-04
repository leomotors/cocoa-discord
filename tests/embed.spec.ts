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

        expect(emb.fields[0]?.name).toEqual("Hi");
        expect(emb.fields[1]?.name).toEqual("Hi2");
        expect(emb.fields[0]?.inline).toBeFalsy();
        expect(emb.fields[1]?.inline).toBeTruthy();
        expect(emb.fields[2]?.inline).toBeTruthy();
        expect(emb.fields[3]?.inline).toBeTruthy();
    });
});
