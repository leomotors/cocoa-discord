// import "./stub";
import {
    ApplicationCommandOptionType,
    ApplicationCommandType,
    RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

import { Param, CogSlashClass, SlashCommand } from "../src/slash/class";

class V2Test extends CogSlashClass {
    @SlashCommand("The command that say hi to specific person")
    async sayhi(
        ctx: SlashCommand.Context,
        @Param.String("Message to say")
        @Param.Choices(["Gay", "Bruh"])
        msg: Param.String.Type,
        @Param.User("User to greet") user: Param.User.Type
    ) {}
}

describe("Slash Command Class V2", () => {
    it("Has Data as expected", async () => {
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
});
