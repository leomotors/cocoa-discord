import {
  ActivityGroupLoader,
  ActivityManager,
  CocoaIntent,
} from "cocoa-discord/utils";
import { Client, Events } from "discord.js";

import { environment } from "./config/environment";
import { pingHandler } from "./handlers/ping";

const client = new Client(new CocoaIntent().useGuild());

// ? Edit data/activites.json to customize, or delete this line to not use activities
const activity = new ActivityGroupLoader("data/activities.json");
const activityManager = new ActivityManager(activity, client);

client.once(Events.ClientReady, async (c) => {
  console.log(`Ready! Logged in as ${c.user.tag}`);

  const guild = await client.guilds.fetch(environment.DEV_GUILD_ID);
  if (!guild) {
    console.log("Guild not found");
    return;
  }
  await guild.commands.set(pingHandler.getCommands());

  activityManager.nextActivity();
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  if (pingHandler.hasCommand(interaction.commandName)) {
    await pingHandler.handleCommandInteraction(interaction);
  }
});

process.on("SIGINT", async () => {
  console.log("Caught interrupt signal, shutting down...");
  await client.destroy();
  process.exit(0);
});

console.log("Logging in...");
await client.login(environment.DISCORD_TOKEN);
