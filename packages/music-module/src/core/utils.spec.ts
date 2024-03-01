import { describe, expect, it } from "vitest";

import { beautifyNumber, parseLength, pickFirst, pickLast } from "./utils.js";

describe("Utils", () => {
  it("pickLast", () => {
    expect(pickLast([])).toBe(undefined);

    expect(pickLast([1])).toBe(1);
    expect(pickLast([1, 2, 3])).toBe(3);

    expect(pickLast(["a"])).toBe("a");
    expect(pickLast(["a", "b", "c"])).toBe("c");

    expect(pickLast([{ a: 1 }])).toEqual({ a: 1 });
    expect(pickLast([{ a: 1 }, { b: 2 }, { c: 3 }])).toEqual({ c: 3 });
  });

  it("pickFirst", () => {
    expect(pickFirst([])).toBe(undefined);

    expect(pickFirst([1])).toBe(1);
    expect(pickFirst([1, 2, 3])).toBe(1);

    expect(pickFirst(["a"])).toBe("a");
    expect(pickFirst(["a", "b", "c"])).toBe("a");

    expect(pickFirst([{ a: 1 }])).toEqual({ a: 1 });
    expect(pickFirst([{ a: 1 }, { b: 2 }, { c: 3 }])).toEqual({ a: 1 });

    expect(pickFirst("hello")).toBe("hello");
    expect(pickFirst(123)).toBe(123);
    expect(pickFirst({ a: 1 })).toEqual({ a: 1 });
  });

  it("parseLength", () => {
    expect(parseLength(0)).toBe("0:00");
    expect(parseLength(1)).toBe("0:01");
    expect(parseLength(59)).toBe("0:59");
    expect(parseLength(60)).toBe("1:00");
    expect(parseLength(61)).toBe("1:01");
    expect(parseLength(119)).toBe("1:59");
    expect(parseLength(120)).toBe("2:00");
    expect(parseLength(121)).toBe("2:01");

    expect(parseLength(3599)).toBe("59:59");
    expect(parseLength(3600)).toBe("60:00");
    expect(parseLength(3601)).toBe("60:01");

    expect(parseLength(359999)).toBe("5999:59");
  });

  it("beautifyNumber", () => {
    expect(beautifyNumber(0)).toBe("0");
    expect(beautifyNumber(1)).toBe("1");
    expect(beautifyNumber(12)).toBe("12");
    expect(beautifyNumber(123)).toBe("123");
    expect(beautifyNumber(1234)).toBe("1 234");
    expect(beautifyNumber(12345)).toBe("12 345");
    expect(beautifyNumber(123456)).toBe("123 456");
    expect(beautifyNumber(1234567)).toBe("1 234 567");
    expect(beautifyNumber(12345678)).toBe("12 345 678");
    expect(beautifyNumber(123456789)).toBe("123 456 789");
    expect(beautifyNumber(1234567890)).toBe("1 234 567 890");

    expect(beautifyNumber("1234567890")).toBe("1 234 567 890");
    expect(beautifyNumber("1234567890")).toBe("1 234 567 890");

    expect(beautifyNumber(undefined)).toBe("Unknown");
    expect(beautifyNumber(null)).toBe("Unknown");

    expect(beautifyNumber(undefined, "Fallback")).toBe("Fallback");
    expect(beautifyNumber(null, "Fallback")).toBe("Fallback");
  });
});
