import { assert } from "chai";

import { parseTime } from "../src/main";

describe("[time] Main Utility: time.ts", () => {
    it("Should work as wanted", () => {
        assert.equal(parseTime(69 * 1000 + 69), "1m 9s");
        assert.equal(parseTime(6969 * 1000 + 512), "1h 56m 9s");
        assert.equal(parseTime(84000 /* เซลล์ */ * 1000), "23h 20m 0s");
    });
});
