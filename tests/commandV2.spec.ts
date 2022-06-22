import { ChatInputCommandInteraction, User } from "discord.js";

import {
    Args,
    CogSlashClass,
    SlashCommandV2 as SlashCommand,
    V2Stores,
} from "../src/slash/class";

class V2Test extends CogSlashClass {
    constructor() {
        super("V2Test");
    }

    @SlashCommand("The command that say hi to specific person")
    async sayhi(
        ctx: ChatInputCommandInteraction,
        @Args.String("Message to say")
        @Args.Choices(["Gay", "Bruh"])
        msg: string,
        @Args.User("User to greet") user: User
    ) {}
}

describe("Slash Command Class V2", () => {
    it("Pass", () => {
        console.log({ V2Stores: JSON.stringify(V2Stores, null, 4) });
    });
});
