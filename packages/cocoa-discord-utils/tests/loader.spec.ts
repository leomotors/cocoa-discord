import "./stub";

import { describe, expect, it } from "vitest";

import { ArrayLoader, Loader } from "../src/main";

describe("[loader] Base Class Loader", () => {
    describe("From Object <string>", fromObject);
    describe("From Json <string>", fromJson);
});

describe("[loader] Array Loader", () => {
    describe("From Array <string>", fromArray);
    describe("From File <string>", fromFile);
});

function fromObject() {
    const name = "From Object";
    const testData = { a: "a", b: "b", c: "c" };

    const loader = Loader.fromObject<Record<string, string>>(name, testData);

    it("Should have Correct Name", () => {
        expect(loader.name).toEqual(name);
    });

    it("Should have Correct Data", () => {
        expect(loader.data).toStrictEqual(testData);
    });
}

function fromJson() {
    const name = "From Json";
    const usaData = {
        Cocoa: "Cocoa",
        Chino: "Chino",
        Rize: "Rize",
        Chiya: "Chiya",
        Syaro: "Syaro",
    };

    const loader = Loader.fromJson<string>(
        name,
        "./tests/mock/usa.object.mock.json"
    );

    it("Should have Correct Name", () => {
        expect(loader.name).toEqual(name);
    });

    it("Should have Correct Data", async () => {
        await loader.initialPromise;
        expect(loader.data).toStrictEqual(usaData);
    });

    it("Reload Works", async () => {
        await loader.reload();
        expect(loader.data).toStrictEqual(usaData);
    });
}

function fromArray() {
    const name = "From Array";
    const testData = ["test1", "test2", "test3", "test4"];

    const loader = ArrayLoader.fromArray<string>(name, testData);

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

    const loader = ArrayLoader.fromFile<string>(
        name,
        "./tests/mock/usa.array.mock.json"
    );

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
