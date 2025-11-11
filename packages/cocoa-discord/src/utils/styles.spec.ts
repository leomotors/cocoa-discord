import { describe, expect, it } from "vitest";

import { createEmbedStyle, EmbedStyle } from "./styles.js";

describe("utils > style", () => {
  const style = new EmbedStyle({
    author: "invoker",
    color: 0x000000,
    footer: (_) => ({
      text: "Hello",
    }),
  });

  it("Has Correct Properties", () => {
    expect(
      // @ts-expect-error Private Props
      style.style.author,
    ).toEqual("invoker");

    expect(
      // @ts-expect-error Private Props
      style.style.footer,
    ).toBeInstanceOf(Function);
  });

  it("resolve() method works", () => {
    expect(
      // @ts-expect-error Private Props
      style.resolve({}, style.style.author),
    ).toEqual(
      // @ts-expect-error Private Props
      style.style.author,
    );

    expect(
      // @ts-expect-error Private Props
      style.resolve({}, style.style.footer),
    ).toStrictEqual({ text: "Hello" });
  });

  it("create function works", () => {
    expect(createEmbedStyle({}) instanceof EmbedStyle).toBeTruthy();
  });
});
