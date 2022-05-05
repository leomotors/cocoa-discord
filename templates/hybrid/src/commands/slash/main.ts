import { CogSlashClass, SlashCommand } from "cocoa-discord-utils/slash/class";
import { AutoBuilder } from "cocoa-discord-utils/template";

import { CommandInteraction } from "discord.js";

export class MainSlashCog extends CogSlashClass {
    private timePinged = 0;

    constructor() {
        super("Main Cog", "Main Slash Cog of this bot");
    }

    @SlashCommand(AutoBuilder("Pong!"))
    async ping(ctx: CommandInteraction) {
        await ctx.reply(
            `Pong! Since start, I have been pinged ${++this.timePinged} times!`
        );
    }
}
