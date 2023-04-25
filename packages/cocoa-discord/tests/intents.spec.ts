import { Client, GatewayIntentBits } from "discord.js";
import { describe, expect, it } from "vitest";

import { CocoaIntent } from "../src/template";

describe("[template/option] CocoaIntent Class", () => {
  it("Can create and pass as parameters", () => {
    const intents = new CocoaIntent().useGuildMessage();

    expect(intents.intents).toStrictEqual([GatewayIntentBits.GuildMessages]);

    const client1 = new Client(intents.useReadMessage());
    const client2 = new Client(
      new CocoaIntent()
        .useGuildMessage({ withReaction: true, withTyping: true })
        .useDirectMessage({ withReaction: true, withTyping: true })
    );

    expect(client2.options.partials?.length).toBe(1);
  });
});
