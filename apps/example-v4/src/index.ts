import { SlashCommandHandler } from "cocoa-discord-v4";
import { Client, Events, GatewayIntentBits } from "discord.js";

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Use local variable instead of class member (from v3)
let pinged = 0;

const handler = new SlashCommandHandler();

handler.addCommand(
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

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const guild = await client.guilds.fetch("827812873363128351");
  if (!guild) {
    console.log("Guild not found");
    return;
  }
  await guild.commands.set(handler.getCommands());
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (handler.hasCommand(interaction.commandName)) {
    await handler.handleInteraction(interaction);
  }
});

process.on("SIGINT", async () => {
  console.log("Caught interrupt signal, shutting down...");
  await client.destroy();
  process.exit(0);
});

await client.login();
