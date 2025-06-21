import { describe, expect, it } from "vitest";

import { createEmbedStyle, EmbedStyle } from "../src/main";

describe("[styles] Embed Style", () => {
  const style = new EmbedStyle({
    author: "invoker",
    color: 0x000000,
    footer: (_) => ({
      text: "Hello",
    }),
  });

  it("Has Correct Properties", () => {
    expect(
      // @ts-ignore Private Props yeet
      style.style.author,
    ).toEqual("invoker");

    expect(
      // @ts-ignore
      style.style.footer,
    ).toBeInstanceOf(Function);
  });

  it("resolve() method works", () => {
    expect(
      // @ts-ignore Private props yeet
      style.resolve({}, style.style.author),
    ).toEqual(
      // @ts-ignore
      style.style.author,
    );

    expect(
      // @ts-ignore yeeett
      style.resolve({}, style.style.footer),
    ).toStrictEqual({ text: "Hello" });
  });

  it("create function works", () => {
    expect(createEmbedStyle({}) instanceof EmbedStyle).toBeTruthy();
  });
});
