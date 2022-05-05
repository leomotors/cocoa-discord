import { CocoaBuildTime, CocoaVersion } from "../src/meta";

describe("[meta] Meta Module Test", () => {
    it("Version is Version ??? >Useless Test<", () => {
        expect(CocoaVersion.split(".").length).toBeGreaterThanOrEqual(3);
        expect(CocoaBuildTime.split("-").length).toBeGreaterThanOrEqual(3);
    });
});
