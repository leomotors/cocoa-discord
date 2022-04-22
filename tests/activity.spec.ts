import { ActivityType } from "discord.js";

import { assert } from "chai";

import { ActivityGroupLoader } from "../src/main";

import Activities from "./mock/activities.mock.json";

describe("[activity] Activity Group Loader", () => {
    const loader = new ActivityGroupLoader("./tests/mock/activities.mock.json");

    it("Loader has 9 Activities (no? check the file and count)", async () => {
        await loader.initialPromise;
        // @ts-ignore or else we can't access *private* properties
        assert.equal(loader.builtData.length, 9);
    });

    it("Get Random Works and Correct (100 times)", async () => {
        await loader.initialPromise;
        for (let i = 0; i < 100; i++) {
            const item = loader.getBuiltRandom();
            assert.include(
                [
                    ActivityType.Playing,
                    ActivityType.Streaming,
                    ActivityType.Listening,
                    ActivityType.Watching,
                    ActivityType.Competing,
                ],
                item?.type
            );

            assert.include(
                // @ts-ignore
                Activities[ActivityType[item?.type].toUpperCase()],
                item?.name
            );
        }
    });

    it("Has IOI", async () => {
        await loader.initialPromise;
        assert.deepInclude(
            // @ts-ignore again so we can *yeet* its private properites
            loader.builtData,
            {
                name: "International Olympiad in Informatics",
                type: ActivityType.Competing,
            }
        );
    });
});
