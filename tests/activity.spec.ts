import { assert } from "chai";

import { ActivityGroupLoader } from "../src/main";

import Activities from "./mock/activities.mock.json";

describe("[activity] Activity Group Loader", () => {
    const loader = new ActivityGroupLoader("./tests/mock/activities.mock.json");

    it("Loader has 10 Activities (no? check the file and count)", async () => {
        await loader.initialPromise;
        // @ts-ignore or else we can't access *private* properties
        assert.equal(loader.builtData.length, 10);
    });

    it("Get Random Works and Correct (100 times)", async () => {
        await loader.initialPromise;
        for (let i = 0; i < 100; i++) {
            const item = loader.getBuiltRandom();
            assert.include(
                ["PLAYING", "LISTENING", "WATCHING", "COMPETING", "STREAMING"],
                // @ts-ignore because I know what I am doing
                item.type
            );
            if (item.type != "STREAMING")
                // @ts-ignore
                assert.include(Activities[item.type], item.name);
        }
    });

    it("Has expected Data", async () => {
        await loader.initialPromise;

        // @ts-ignore again so we can *yeet* its private properites
        const yeet = loader.builtData;

        assert.deepInclude(yeet, {
            name: "International Olympiad in Informatics",
            type: "COMPETING",
        });
        assert.deepInclude(yeet, {
            name: "The Asian Pacific Informatics Olympiad",
            type: "STREAMING",
        });
        assert.deepInclude(yeet, {
            name: "IPST Round 2",
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        });
    });
});
