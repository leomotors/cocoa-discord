import { CogSlashClass, SlashCommand } from "cocoa-discord-utils/slash/class";

export class MainSlashCog extends CogSlashClass {
  private timePinged = 0;

  constructor() {
    super("Main Cog", "Main Slash Cog of this bot");
  }

  @SlashCommand("Pong!")
  async ping(ctx: SlashCommand.Context) {
    await ctx.reply(
      `Pong! Since start, I have been pinged ${++this.timePinged} times!`,
    );
  }
}
