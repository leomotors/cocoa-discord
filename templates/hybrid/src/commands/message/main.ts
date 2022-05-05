import {
    CogMessageClass,
    MessageCommand,
} from "cocoa-discord-utils/message/class";

import { Message } from "discord.js";

export class MainMessageCog extends CogMessageClass {
    private timePinged = 0;

    constructor() {
        super("Main Cog", "Main Message Cog of this bot");
    }

    @MessageCommand({ description: "Pong!" })
    async ping(ctx: Message) {
        await ctx.reply(
            `Pong! Since start, I have been pinged ${++this.timePinged} times!`
        );
    }
}
