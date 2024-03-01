import { describe, expect, it } from "vitest";

import { generateId } from "./constants.js";

describe("constants", () => {
  it("Should work as expected", () => {
    expect(generateId("test-")).toMatch(/^test-/);
  });
});
