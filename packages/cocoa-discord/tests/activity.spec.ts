import { ActivityType } from "discord-api-types/v10";
import { beforeEach, describe, expect, it } from "vitest";

import {
  ActivityGroupLoader,
  ActivityManager,
  isGroupLoader,
} from "../src/main";

import Activities from "./mock/activities.mock.json";
import "./stub";

describe("[activity] Activity Group Loader", () => {
  const loader = new ActivityGroupLoader("./tests/mock/activities.mock.json");

  beforeEach(async () => {
    await loader.initialPromise;
  });

  it("Loader has 10 Activities (no? check the file and count)", async () => {
    expect(
      // @ts-expect-error or else we can't access *private* properties
      loader.builtData.length
    ).toStrictEqual(10);
  });

  it("Get Random Works and Correct (100 times)", async () => {
    for (let i = 0; i < 100; i++) {
      const item = loader.getBuiltRandom();
      expect([
        ActivityType.Playing,
        ActivityType.Streaming,
        ActivityType.Listening,
        ActivityType.Watching,
        ActivityType.Competing,
      ]).toContain(item!.type);

      if (item!.url)
        expect(
          Activities[ActivityType[item!.type!].toUpperCase()]
        ).toContainEqual({ name: item!.name, url: item!.url });
      else
        expect(Activities[ActivityType[item!.type!].toUpperCase()]).toContain(
          item!.name
        );
    }
  });

  it("Has expected Data", async () => {
    // @ts-expect-error again so we can *yeet* its private properites
    const yeet = loader.builtData;

    expect(yeet).toContainEqual({
      name: "International Olympiad in Informatics",
      type: ActivityType.Competing,
    });

    expect(yeet).toContainEqual({
      name: "The Asian Pacific Informatics Olympiad",
      type: ActivityType.Streaming,
    });

    expect(yeet).toContainEqual({
      name: "IPST Round 2",
      type: ActivityType.Streaming,
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    });
  });

  it("assertInterval works", () => {
    expect(() => ActivityManager.assertInterval(500)).toThrowError();
    ActivityManager.assertInterval(6969);
  });

  it("Typeguard works", () => {
    expect(isGroupLoader(loader)).toBe(true);
  });
});
