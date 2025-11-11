import { describe, expect, it } from "vitest";

import { getElapsed } from "./perf.js";

const time = 1655640259 * 1000;

describe("utils > perf", () => {
  it("perf.ts : getElapsed function", () => {
    expect(getElapsed(0)).toBeGreaterThan(time);
    expect(getElapsed(new Date(0))).toBeGreaterThan(time);
  });
});
