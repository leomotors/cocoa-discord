import { describe, expect, it } from "vitest";

import { getLinuxUptime } from "./sysinfo.js";

describe("utils > sysinfo", () => {
  it("sysinfo: getLinuxUptime", async () => {
    const uptime = await getLinuxUptime();

    expect(uptime).toMatch(/[0-9]/);
  });
});
