import { assert } from "chai";

import { CocoaBuilder, ephemeral } from "../src/template";

describe("Template Module", () => {
    it("Cocoa Builder", () => {
        const b = CocoaBuilder("test", "test");
        assert.equal(b.name, "test");
        assert.equal(b.name, "test");
    });

    it("ephemeral", () => {
        class Ephemeral {
            constructor(
                public name?: string,
                public description?: string,
                public required?: boolean
            ) {}
            setName(name: string) {
                return new Ephemeral(name, this.description, this.required);
            }
            setDescription(desc: string) {
                return new Ephemeral(this.name, desc, this.required);
            }
            setRequired(req: boolean) {
                return new Ephemeral(this.name, this.description, req);
            }
        }

        let ep = new Ephemeral();

        ep = ephemeral()(ep);

        assert.equal(ep.name, "ephemeral");
        assert.equal(ep.description, "Make your request ephemeral");

        ep = ephemeral("bruh")(ep);

        assert.equal(ep.description, "bruh");
        assert.strictEqual(ep.required, false);
    });
});
