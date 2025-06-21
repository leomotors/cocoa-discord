// import "../stub";
import { Client } from "discord.js";
import { describe, expect, it } from "vitest";

import { GlobalCommand, SlashCenter } from "../../src/slash";
import { Guilds, SlashCommand, SlashModuleClass } from "../../src/slash/class";

const client = new Client({ intents: [] });

describe("Testing Guild IDs Union", () => {
  it("Union IDs with Decorators", async () => {
    class UnionIds extends SlashModuleClass {
      @Guilds(["123"])
      @SlashCommand("Bruh")
      async bruh(_: SlashCommand.Context) {
        return;
      }
    }

    const center = new SlashCenter(client, ["000"]);
    const cog = new UnionIds();
    await cog.presync();
    center.addModules(cog);

    // @ts-ignore yeet: Access protected property
    const gids = center.unionAllGuildIds();

    expect(gids).toStrictEqual(["000", "123"]);

    // @ts-ignore yeet: Protected Property
    expect(center.modules[0].commands.bruh.guild_ids).toStrictEqual(["123"]);
  });

  it("Union IDs with One Global", async () => {
    class UnionIds extends SlashModuleClass {
      @Guilds(["123"])
      @SlashCommand("Bruh")
      async bruh(_: SlashCommand.Context) {
        return;
      }

      @Guilds("Global")
      @SlashCommand("This is global command")
      async global(_: SlashCommand.Context) {
        return;
      }
    }

    const center = new SlashCenter(client, ["000"]);
    const cog = new UnionIds();
    await cog.presync();
    center.addModules(cog);

    // @ts-ignore yeet: Access protected property
    const gids = center.unionAllGuildIds();

    expect(gids).toStrictEqual("Global");

    // @ts-ignore yeet: Protected Property
    expect(center.modules[0].commands.bruh.guild_ids).toStrictEqual(["123"]);
    // @ts-ignore yeet: Protected Property
    expect(center.modules[0].commands.global.guild_ids).toStrictEqual("Global");
  });

  it("Union IDs with Root Global", async () => {
    class UnionIds2 extends SlashModuleClass {
      @Guilds(["123"])
      @SlashCommand("Bruh")
      async bruh(_: SlashCommand.Context) {
        return;
      }

      @Guilds(["69420"])
      @SlashCommand("This is global command")
      async global(_: SlashCommand.Context) {
        return;
      }
    }

    const center = new SlashCenter(client, "Global");
    const cog = new UnionIds2();
    await cog.presync();
    center.addModules(cog);

    // @ts-ignore yeet: Access protected property
    const gids = center.unionAllGuildIds();

    expect(gids).toStrictEqual("Global");

    // @ts-ignore yeet: Protected Property
    expect(center.modules[0].commands.bruh.guild_ids).toStrictEqual(["123"]);
    // @ts-ignore yeet: Protected Property
    expect(center.modules[0].commands.global.guild_ids).toStrictEqual([
      "69420",
    ]);
  });

  it("Building Commands Pack 1", async () => {
    class TestCog extends SlashModuleClass {
      @Guilds(["123"])
      @SlashCommand("Bruh")
      async bruh(_: SlashCommand.Context) {
        return;
      }

      @Guilds("Global")
      @SlashCommand("This is global command")
      async global(_: SlashCommand.Context) {
        return;
      }
    }

    const center = new SlashCenter(client, ["000"]);

    const cog = new TestCog();
    await cog.presync();
    center.addModules(cog);

    // @ts-ignore yeet private properties
    const { commandData, guildIdsSet } = await center.buildCommandsPack();

    expect(guildIdsSet).toStrictEqual(new Set(["000", "123"]));
    expect(
      commandData.filter((data) => data[0].name === "bruh")[0][1],
    ).toStrictEqual(["123"]);
    expect(
      commandData.filter((data) => data[0].name === "global")[0][1],
    ).toStrictEqual("Global");
  });

  it("Building Commands Pack 2", async () => {
    class TestCog2 extends SlashModuleClass {
      @Guilds(["123"])
      @SlashCommand("Bruh")
      async bruh(_: SlashCommand.Context) {
        return;
      }

      @SlashCommand("Unspecified one is default to Global")
      async unspec(_: SlashCommand.Context) {
        return;
      }
    }

    const center = new SlashCenter(client, GlobalCommand);

    const cog = new TestCog2();
    await cog.presync();
    center.addModules(cog);

    // @ts-ignore yeet private properties
    const { commandData, guildIdsSet } = await center.buildCommandsPack();

    expect(guildIdsSet).toStrictEqual(new Set(["123"]));
    expect(
      commandData.filter((data) => data[0].name === "bruh")[0][1],
    ).toStrictEqual(["123"]);
    expect(
      commandData.filter((data) => data[0].name === "unspec")[0][1],
    ).toStrictEqual(GlobalCommand);
  });

  it("Building Commands Pack 3", async () => {
    class TestCog3 extends SlashModuleClass {
      @SlashCommand("Bruh")
      async bruh(_: SlashCommand.Context) {
        return;
      }

      @SlashCommand("Unspecified one is default to Global")
      async unspec(_: SlashCommand.Context) {
        return;
      }
    }

    const center = new SlashCenter(client, GlobalCommand);

    const cog = new TestCog3();
    await cog.presync();
    center.addModules(cog);
    // @ts-ignore yeet private method
    center._useHelpCommand();

    // @ts-ignore yeet private method
    const { commandData, guildIdsSet } = await center.buildCommandsPack();

    expect(guildIdsSet).toStrictEqual(new Set());
    expect(
      commandData.filter((data) => data[0].name === "bruh")[0][1],
    ).toStrictEqual(GlobalCommand);
    expect(
      commandData.filter((data) => data[0].name === "unspec")[0][1],
    ).toStrictEqual(GlobalCommand);
  });
});
