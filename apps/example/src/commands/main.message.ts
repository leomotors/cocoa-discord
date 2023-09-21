import {
  MessageCommand,
  MessageModuleClass,
} from "cocoa-discord/message/class";

import { Message } from "discord.js";

export class MainMessageModule extends MessageModuleClass {
  private timePinged = 0;

  constructor() {
    super("Main Cog", "Main Message Cog of this bot");
  }

  @MessageCommand({ description: "Pong!" })
  async ping(ctx: Message) {
    await ctx.reply(
      `Pong! Since start, I have been pinged ${++this.timePinged} times!`,
    );
  }
}
