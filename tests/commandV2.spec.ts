// import "./stub";
import { describe, it, expect } from "vitest";

import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

import { Param, CogSlashClass, SlashCommand } from "../src/slash/class";

describe("Slash Command Class V2", () => {
    it("Has Data as expected", async () => {
        class V2Test extends CogSlashClass {
            @SlashCommand("The command that say hi to specific person")
            async sayhi(
                ctx: SlashCommand.Context,
                @Param.String("Message to say")
                @Param.Choices<Param.String.Type>(["Gay", "Bruh"])
                msg: Param.String.Type,
                @Param.User("User to greet") user: Param.User.Type
            ) {}
        }

        const v2 = new V2Test();
        await v2.presync();

        expect(v2.name).toBe("V2Test");

        const commands = v2.commands;
        const sayhi = commands.sayhi
            .command as RESTPostAPIChatInputApplicationCommandsJSONBody;
        expect(sayhi.name).toBe("sayhi");
        expect(sayhi.description).toBe(
            "The command that say hi to specific person"
        );
        expect(sayhi.type).toBe(ApplicationCommandType.ChatInput);

        expect(sayhi.options![0].name).toBe("msg");
        expect(sayhi.options![0].description).toBe("Message to say");
        expect(sayhi.options![0].type).toBe(
            ApplicationCommandOptionType.String
        );
        // @ts-ignore
        expect(sayhi.options![0].choices).toStrictEqual([
            { name: "Gay", value: "Gay" },
            { name: "Bruh", value: "Bruh" },
        ]);

        expect(sayhi.options![1].name).toBe("user");
        expect(sayhi.options![1].description).toBe("User to greet");
        expect(sayhi.options![1].type).toBe(ApplicationCommandOptionType.User);
    });

    it("Should throw error when using Param in wrong position", () => {
        expect(() => {
            class _ extends CogSlashClass {
                @SlashCommand("Pong!")
                async ping(
                    @Param.String("Pong!")
                    ctx: SlashCommand.Context
                ) {}
            }
        }).toThrowError(/First argument must be ctx/);
    });

    class test extends CogSlashClass {
        @SlashCommand("Pong!")
        async ping(
            ctx: SlashCommand.Context,
            @Param.String("Message to say")
            @Param.Choices<Param.String.Type>(async () => ["Gay", "Bruh"])
            msg: Param.String.Type
        ) {}
    }

    it("Built in async choice resolver works", async () => {
        const inst = new test();
        await inst.presync();
        const ping = inst.commands.ping
            .command as RESTPostAPIChatInputApplicationCommandsJSONBody;
        // @ts-ignore
        expect(ping.options![0].choices).toStrictEqual([
            { name: "Gay", value: "Gay" },
            { name: "Bruh", value: "Bruh" },
        ]);
    });

    it("Resolver with number works", async () => {
        class test2 extends CogSlashClass {
            @SlashCommand("Pong!")
            async ping(
                ctx: SlashCommand.Context,
                @Param.Number("Message to say")
                @Param.Choices<Param.Number.Type>(async () => [69, 420])
                msg: Param.Number.Type
            ) {}
        }
        const inst = new test2();
        await inst.presync();

        const ping = inst.commands.ping
            .command as RESTPostAPIChatInputApplicationCommandsJSONBody;
        // @ts-ignore
        expect(ping.options![0].choices).toStrictEqual([
            { name: "69", value: 69 },
            { name: "420", value: 420 },
        ]);
    });
});
