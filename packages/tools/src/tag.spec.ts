import { describe, expect, it } from "vitest";

import { getTag } from "./tag.mjs";

describe("tag", () => {
  it("Works", () => {
    expect(getTag("cocoa-discord@1.0.0")).toStrictEqual({
      packageName: "cocoa-discord",
      packageTitle: "Cocoa Discord",
      packagePath: "packages/cocoa-discord",
      version: "1.0.0",
      tag: "latest",
    });

    expect(getTag("@cocoa-discord/music-module@1.0.0-beta.69")).toStrictEqual({
      packageName: "@cocoa-discord/music-module",
      packageTitle: "Music Module",
      packagePath: "packages/music-module",
      version: "1.0.0-beta.69",
      tag: "beta",
    });

    expect(getTag("j3k@1.0.0-beta.69")).toStrictEqual({
      packageName: "j3k",
      packageTitle: "J3k",
      packagePath: "packages/j3k",
      version: "1.0.0-beta.69",
      tag: "beta",
    });
  });

  it("Invalid format", () => {
    expect(() => getTag("69.4.20")).toThrowError();
    expect(() => getTag("discord")).toThrowError();
    expect(() => getTag("@discord")).toThrowError();
    expect(() => getTag("discord@")).toThrowError();
    expect(() => getTag("@discord@")).toThrowError();
    expect(() => getTag("@1.0.0")).toThrowError();
  });

  it("Invalid package name", () => {
    expect(() => getTag("helloWORLD@1.0.0")).toThrowError();
    expect(() => getTag("hello_world@1.0.0")).toThrowError();
    expect(() => getTag("hello world@1.0.0")).toThrowError();
    expect(() => getTag("@cocoa@1.0.0")).toThrowError();
    expect(() => getTag("@cocoa/deez nuts@1.0.0")).toThrowError();
    expect(() => getTag("@cocoa/deez/nuts@1.0.0")).toThrowError();
  });

  it("Invalid version", () => {
    expect(() => getTag("hello@world")).toThrowError();
    expect(() => getTag("hello@1.x.x")).toThrowError();
  });
});
