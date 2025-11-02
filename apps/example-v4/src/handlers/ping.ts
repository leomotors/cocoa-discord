import { SlashCommandHandler } from "cocoa-discord-v4";

// Use local variable instead of class member (from v3)
let pinged = 0;

export const pingHandler = new SlashCommandHandler();

pingHandler.addCommand(
  (builder) =>
    builder
      .setName("ping")
      .setDescription("An example command")
      .addStringOption({
        name: "ping",
        description: "pong",
      })
      .addIntegerOption({
        name: "count",
        description: "idk",
      }),
  async (ctx, { ping, count }) => {
    pinged++;
    // here: ping is typed as string and count is typed as number
    await ctx.reply(
      `You provided: ping: ${ping} and count: ${count} and called this command total of ${pinged} times!`,
    );
  },
);
