import { assert } from "chai";

import { CocoaBuilder, Ephemeral } from "../src/template";

describe("[template] Template Module", () => {
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
                this.name = name;
                return this;
            }
            setDescription(desc: string) {
                this.description = desc;
                return this;
            }
            setRequired(req: boolean) {
                this.required = req;
                return this;
            }
        }

        const ep = new DummyEphemeral();

        Ephemeral()(ep);

        assert.equal(ep.name, "ephemeral");
        assert.equal(ep.description, "Make your request ephemeral");

        Ephemeral("bruh")(ep);

        assert.equal(ep.description, "bruh");
        assert.strictEqual(ep.required, false);
    });
});
