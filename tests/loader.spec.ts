import { assert } from "chai";

import { Loader } from "../src/main";

describe("index / Base Class Loader", () => {
    describe("From Array <string>", fromArray);
    describe("From File <string>", fromFile);
});

function fromArray() {
    const name = "From Array";
    const testData = ["test1", "test2", "test3", "test4"];

    const loader = Loader.fromArray<string>(name, testData);

    it("Should have Correct Name", () => {
        assert.equal(loader.name, name);
    });

    it("Should have Correct Data", () => {
        assert.deepEqual(loader.data, testData);
    });

    it("Get Random Works and Correct (100 times)", () => {
        for (let i = 0; i < 100; i++) {
            const item = loader.getRandom();
            assert.include(testData, item);
        }
    });
}

function fromFile() {
    const name = "From File";
    const usaData = ["Cocoa", "Chino", "Rize", "Chiya", "Syaro"];

    const loader = Loader.fromFile<string>(name, "./tests/mock/usa.mock.json");

    it("Should have Correct Name", () => {
        assert.equal(loader.name, name);
    });

    it("Should have Correct Data", async () => {
        await loader.initialPromise;
        assert.deepEqual(loader.data, usaData);
    });

    it("Get Random Works", async () => {
        await loader.initialPromise;
        const item = loader.getRandom();
        assert.include(usaData, item);
    });

    it("Reload Works", async () => {
        await loader.reload();
        assert.deepEqual(loader.data, usaData);
    });
}
