import { assert } from "chai";
import { Loader } from "../src/main";

function fromArray() {
    const name = "From Array";

    const loader = Loader.fromArray<string>(name, ["test1", "test2"]);
    it("Should have Correct Name", () => {
        assert.equal(loader.name, name);
    });
    it("Should have Correct Data", () => {
        assert.deepEqual(loader.data, ["test1", "test2"]);
    });
    it("Get Random Works", () => {
        const item = loader.getRandom();
        assert.isTrue(["test1", "test2"].includes(item));
    });
}

function fromFile() {
    const name = "From File";

    const loader = Loader.fromFile<string>(name, "./tests/usa.mock.json");

    it("Should have Correct Name", () => {
        assert.equal(loader.name, name);
    });
    it("Should have Correct Data", () => {
        assert.deepEqual(loader.data, [
            "Cocoa",
            "Chino",
            "Rize",
            "Chiya",
            "Syaro",
        ]);
    });
    it("Get Random Works", () => {
        const item = loader.getRandom();
        assert.isTrue(
            ["Cocoa", "Chino", "Rize", "Chiya", "Syaro"].includes(item)
        );
    });
    it("Reload Works", async () => {
        await loader.reload();
    });
}

describe("Loader", () => {
    describe("From Array", fromArray);
    describe("From File", fromFile);
});
