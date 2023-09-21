import { SlashCommand, SlashModuleClass } from "cocoa-discord/slash/class";

export class MainSlashModule extends SlashModuleClass {
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
