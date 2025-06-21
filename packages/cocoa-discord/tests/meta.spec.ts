import { describe, expect, it } from "vitest";

import {
  CocoaBuildTime,
  CocoaVersion,
  getElapsed,
  getLinuxUptime,
} from "../src/meta";

const time = 1655640259 * 1000;

describe("[meta] Meta Module Test", () => {
  it("Version is Version ??? >Useless Test<", () => {
    expect(CocoaVersion.split(".").length).toBeGreaterThanOrEqual(3);
    expect(CocoaBuildTime.split("-").length).toBeGreaterThanOrEqual(3);
  });

  it("perf.ts : getElapsed function", () => {
    expect(getElapsed(0)).toBeGreaterThan(time);
    expect(getElapsed(new Date(0))).toBeGreaterThan(time);
  });

  it("sysinfo: getLinuxUptime", async () => {
    const uptime = await getLinuxUptime();

    expect(uptime).toMatch(/[0-9]/);
  });
});
