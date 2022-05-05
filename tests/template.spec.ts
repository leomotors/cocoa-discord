import { CocoaBuilder, Ephemeral } from "../src/template";

describe("[template] Template Module", () => {
    it("Cocoa Builder", () => {
        const b = CocoaBuilder("test", "test");
        expect(b.name).toEqual("test");
        expect(b.description).toEqual("test");
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

        expect(ep.name).toEqual("ephemeral");
        expect(ep.description).toEqual("Make your request ephemeral");

        Ephemeral("bruh")(ep);

        expect(ep.description).toEqual("bruh");
        expect(ep.required).toStrictEqual(false);
    });
});
