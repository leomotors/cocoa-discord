import { assert } from "chai";

import { CocoaBuildTime, CocoaVersion } from "../src/meta";

describe("Meta Module Test", () => {
    it("Version is Version ??? >Useless Test<", () => {
        assert.isTrue(CocoaVersion.split(".").length >= 3);
        assert.isTrue(CocoaBuildTime.split("-").length >= 3);
    });
});
