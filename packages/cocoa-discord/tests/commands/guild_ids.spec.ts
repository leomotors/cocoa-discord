// import "../stub";
import { describe, expect, it } from "vitest";

import { Client } from "discord.js";

import { GlobalCommand, SlashCenter } from "../../src/slash";
import { CogSlashClass, Guilds, SlashCommand } from "../../src/slash/class";

const client = new Client({ intents: [] });

describe("Testing Guild IDs Union", () => {
    it("Union IDs with Decorators", async () => {
        class UnionIds extends CogSlashClass {
            @Guilds(["123"])
            @SlashCommand("Bruh")
            async bruh(ctx: SlashCommand.Context) {
                return;
            }
        }

        const center = new SlashCenter(client, ["000"]);
        const cog = new UnionIds();
        await cog.presync();
        center.addCogs(cog);

        // @ts-ignore yeet: Access protected property
        const gids = center.unionAllGuildIds();

        expect(gids).toStrictEqual(["000", "123"]);

        // @ts-ignore yeet: Protected Property
        expect(center.cogs[0].commands.bruh.guild_ids).toStrictEqual(["123"]);
    });

    it("Union IDs with One Global", async () => {
        class UnionIds extends CogSlashClass {
            @Guilds(["123"])
            @SlashCommand("Bruh")
            async bruh(ctx: SlashCommand.Context) {
                return;
            }

            @Guilds("Global")
            @SlashCommand("This is global command")
            async global(ctx: SlashCommand.Context) {
                return;
            }
        }

        const center = new SlashCenter(client, ["000"]);
        const cog = new UnionIds();
        await cog.presync();
        center.addCogs(cog);

        // @ts-ignore yeet: Access protected property
        const gids = center.unionAllGuildIds();

        expect(gids).toStrictEqual("Global");

        // @ts-ignore yeet: Protected Property
        expect(center.cogs[0].commands.bruh.guild_ids).toStrictEqual(["123"]);
        // @ts-ignore yeet: Protected Property
        expect(center.cogs[0].commands.global.guild_ids).toStrictEqual(
            "Global"
        );
    });

    it("Union IDs with Root Global", async () => {
        class UnionIds2 extends CogSlashClass {
            @Guilds(["123"])
            @SlashCommand("Bruh")
            async bruh(ctx: SlashCommand.Context) {
                return;
            }

            @Guilds(["69420"])
            @SlashCommand("This is global command")
            async global(ctx: SlashCommand.Context) {
                return;
            }
        }

        const center = new SlashCenter(client, "Global");
        const cog = new UnionIds2();
        await cog.presync();
        center.addCogs(cog);

        // @ts-ignore yeet: Access protected property
        const gids = center.unionAllGuildIds();

        expect(gids).toStrictEqual("Global");

        // @ts-ignore yeet: Protected Property
        expect(center.cogs[0].commands.bruh.guild_ids).toStrictEqual(["123"]);
        // @ts-ignore yeet: Protected Property
        expect(center.cogs[0].commands.global.guild_ids).toStrictEqual([
            "69420",
        ]);
    });

    it("Building Commands Pack 1", async () => {
        class TestCog extends CogSlashClass {
            @Guilds(["123"])
            @SlashCommand("Bruh")
            async bruh(ctx: SlashCommand.Context) {
                return;
            }

            @Guilds("Global")
            @SlashCommand("This is global command")
            async global(ctx: SlashCommand.Context) {
                return;
            }
        }

        const center = new SlashCenter(client, ["000"]);

        const cog = new TestCog();
        await cog.presync();
        center.addCogs(cog);

        // @ts-ignore yeet private properties
        const { guildIdsSet, commandData } = await center.buildCommandsPack();

        expect(guildIdsSet).toStrictEqual(new Set(["000", "123"]));
        expect(
            commandData.filter((data) => data[0].name === "bruh")[0][1]
        ).toStrictEqual(["123"]);
        expect(
            commandData.filter((data) => data[0].name === "global")[0][1]
        ).toStrictEqual("Global");
    });

    it("Building Commands Pack 2", async () => {
        class TestCog2 extends CogSlashClass {
            @Guilds(["123"])
            @SlashCommand("Bruh")
            async bruh(ctx: SlashCommand.Context) {
                return;
            }

            @SlashCommand("Unspecified one is default to Global")
            async unspec(ctx: SlashCommand.Context) {
                return;
            }
        }

        const center = new SlashCenter(client, GlobalCommand);

        const cog = new TestCog2();
        await cog.presync();
        center.addCogs(cog);

        // @ts-ignore yeet private properties
        const { guildIdsSet, commandData } = await center.buildCommandsPack();

        expect(guildIdsSet).toStrictEqual(new Set(["123"]));
        expect(
            commandData.filter((data) => data[0].name === "bruh")[0][1]
        ).toStrictEqual(["123"]);
        expect(
            commandData.filter((data) => data[0].name === "unspec")[0][1]
        ).toStrictEqual(GlobalCommand);
    });

    it("Building Commands Pack 3", async () => {
        class TestCog3 extends CogSlashClass {
            @SlashCommand("Bruh")
            async bruh(ctx: SlashCommand.Context) {
                return;
            }

            @SlashCommand("Unspecified one is default to Global")
            async unspec(ctx: SlashCommand.Context) {
                return;
            }
        }

        const center = new SlashCenter(client, GlobalCommand);

        const cog = new TestCog3();
        await cog.presync();
        center.addCogs(cog);
        // @ts-ignore yeet private method
        center._useHelpCommand();

        // @ts-ignore yeet private method
        const { guildIdsSet, commandData } = await center.buildCommandsPack();

        expect(guildIdsSet).toStrictEqual(new Set());
        expect(
            commandData.filter((data) => data[0].name === "bruh")[0][1]
        ).toStrictEqual(GlobalCommand);
        expect(
            commandData.filter((data) => data[0].name === "unspec")[0][1]
        ).toStrictEqual(GlobalCommand);
    });
});
