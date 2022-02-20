import { assert } from "chai";

import { CocoaBuilder, Ephemeral } from "../src/template";

describe("Template Module", () => {
    it("Cocoa Builder", () => {
        const b = CocoaBuilder("test", "test");
        assert.equal(b.name, "test");
        assert.equal(b.name, "test");
    });

    it("Ephemeral", () => {
        class DummyEphemeral {
            constructor(
                public name?: string,
                public description?: string,
                public required?: boolean
            ) {}
            setName(name: string) {
                return new DummyEphemeral(
                    name,
                    this.description,
                    this.required
                );
            }
            setDescription(desc: string) {
                return new DummyEphemeral(this.name, desc, this.required);
            }
            setRequired(req: boolean) {
                return new DummyEphemeral(this.name, this.description, req);
            }
        }

        let ep = new DummyEphemeral();

        ep = Ephemeral()(ep);

        assert.equal(ep.name, "ephemeral");
        assert.equal(ep.description, "Make your request ephemeral");

        ep = Ephemeral("bruh")(ep);

        assert.equal(ep.description, "bruh");
        assert.strictEqual(ep.required, false);
    });
});
