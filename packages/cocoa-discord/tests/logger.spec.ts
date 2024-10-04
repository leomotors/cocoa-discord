import { describe, expect, it } from "vitest";

import { Cocoa, LogStatus } from "../src/main";

describe("[logger] Logger", () => {
  it("Normal", () => {
    const f = Cocoa.format("Hello World");

    expect(f).toMatch(/^\[/);
    expect(f).toMatch(/World$/);
  });

  it("Success should be Green", () => {
    const f = Cocoa.format("Hello World", LogStatus.Success);

    // eslint-disable-next-line no-control-regex
    expect(f).toMatch(/^\x1B\[32m/);
  });
});
