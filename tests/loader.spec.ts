import "./stub";

import { Loader } from "../src/main";

describe("[loader] Base Class Loader", () => {
    describe("From Array <string>", fromArray);
    describe("From File <string>", fromFile);
});

function fromArray() {
    const name = "From Array";
    const testData = ["test1", "test2", "test3", "test4"];

    const loader = Loader.fromArray<string>(name, testData);

    it("Should have Correct Name", () => {
        expect(loader.name).toEqual(name);
    });

    it("Should have Correct Data", () => {
        expect(loader.data).toStrictEqual(testData);
    });

    it("Get Random Works and Correct (100 times)", () => {
        for (let i = 0; i < 100; i++) {
            const item = loader.getRandom();
            expect(testData).toContain(item);
        }
    });
}

function fromFile() {
    const name = "From File";
    const usaData = ["Cocoa", "Chino", "Rize", "Chiya", "Syaro"];

    const loader = Loader.fromFile<string>(name, "./tests/mock/usa.mock.json");

    it("Should have Correct Name", () => {
        expect(loader.name).toEqual(name);
    });

    it("Should have Correct Data", async () => {
        await loader.initialPromise;
        expect(loader.data).toStrictEqual(usaData);
    });

    it("Get Random Works", async () => {
        await loader.initialPromise;
        const item = loader.getRandom();
        expect(usaData).toContain(item);
    });

    it("Reload Works", async () => {
        await loader.reload();
        expect(loader.data).toStrictEqual(usaData);
    });
}
