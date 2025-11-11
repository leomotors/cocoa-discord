import { SlashCommandHandler } from "cocoa-discord";

// Use local variable instead of class member (from v3)
let pinged = 0;

export const pingHandler = new SlashCommandHandler("ping");

pingHandler.addCommand(
  (builder) =>
    builder
      .setName("ping")
      .setDescription("An example command")
      .addStringOption({
        name: "ping",
        description: "pong",
        autocomplete: true,
      })
      .addIntegerOption({
        name: "count",
        description: "idk",
        autocomplete: true,
      }),
  async (ctx, { ping, count }) => {
    pinged++;
    // here: ping is typed as string and count is typed as number
    await ctx.reply(
      `You provided: ping: ${ping} and count: ${count} and called this command total of ${pinged} times!`,
    );
  },
  {
    autocomplete: {
      async count(ctx, { value, verify }) {
        // Value is typed as number
        console.log(`Count received value: ${value}`);

        // use this to check type
        verify([
          // Pass
          { name: "One", value: 1 },
          // Type Error
          // { name: "Two", value: "2" },
        ]);
      },
      async ping(ctx, { value, verify }) {
        // Value is typed as string
        console.log(`Ping received value: ${value}`);

        // use this to check type
        verify([
          // Pass
          { name: "One", value: "1" },
          // Type Error
          // { name: "Two", value: 2 },
        ]);
      },
    },
  },
);
