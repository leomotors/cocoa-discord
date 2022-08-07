import { describe, expect, it } from "vitest";

import { parseTime } from "../src/main";

describe("[time] Main Utility: time.ts", () => {
    it("Should work as wanted", () => {
        expect(parseTime(69 * 1000 + 69)).toEqual("1m 9s");
        expect(parseTime(6969 * 1000 + 512)).toEqual("1h 56m 9s");
        expect(parseTime(84000 /* เซลล์ */ * 1000)).toEqual("23h 20m 0s");
    });
});
