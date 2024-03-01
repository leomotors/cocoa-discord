import { describe, expect, it, vi } from "vitest";

import { ManagementCenter } from "../src/base/Center.js";

describe("Base Abstract Center", () => {
  it("Event Handler", () => {
    // @ts-expect-error Gean For Unit Test
    const center = new ManagementCenter({}, [], { error: [] });
    expect(center.hasHandler("error")).toBe(false);

    const errorHandlerMock = vi.fn();
    center.on("error", errorHandlerMock);
    expect(center.hasHandler("error")).toBe(true);

    center.runAllHandler("error", "test");
    expect(errorHandlerMock).toHaveBeenCalledWith("test");
  });
});
