import "./stub";

import { ActivityGroupLoader } from "../src/main";

import Activities from "./mock/activities.mock.json";

describe("[activity] Activity Group Loader", () => {
    const loader = new ActivityGroupLoader("./tests/mock/activities.mock.json");

    it("Loader has 10 Activities (no? check the file and count)", async () => {
        await loader.initialPromise;

        expect(
            // @ts-ignore or else we can't access *private* properties
            loader.builtData.length
        ).toStrictEqual(10);
    });

    it("Get Random Works and Correct (100 times)", async () => {
        await loader.initialPromise;
        for (let i = 0; i < 100; i++) {
            const item = loader.getBuiltRandom();
            expect([
                "PLAYING",
                "LISTENING",
                "WATCHING",
                "COMPETING",
                "STREAMING",
            ]).toContain(item.type);
            if (item.type != "STREAMING")
                expect(
                    // @ts-ignore
                    Activities[item.type]
                ).toContain(item.name);
        }
    });

    it("Has expected Data", async () => {
        await loader.initialPromise;

        // @ts-ignore again so we can *yeet* its private properites
        const yeet = loader.builtData;

        expect(yeet).toContainEqual({
            name: "International Olympiad in Informatics",
            type: "COMPETING",
        });

        expect(yeet).toContainEqual({
            name: "The Asian Pacific Informatics Olympiad",
            type: "STREAMING",
        });

        expect(yeet).toContainEqual({
            name: "IPST Round 2",
            type: "STREAMING",
            url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
        });
    });
});
