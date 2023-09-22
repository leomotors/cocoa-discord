// @ts-check
import "dotenv/config";

import { ConsoleManager, EmbedStyle, checkLogin } from "cocoa-discord";
import { SlashCenter } from "cocoa-discord/slash";
import { CocoaIntent } from "cocoa-discord/template";

import { Client } from "discord.js";

// import { Music } from "@cocoa-discord/music-module"
import { Music } from "../dist/index.js";

// * A simple discord bot to E2E (manually) test this module
// * Also minimum code required to fire the bot
// * Good Example!

const client = new Client(new CocoaIntent().useGuild().useGuildVoice());
const style = new EmbedStyle({
  author: "invoker",
  color: 0xd7f6fc,
  footer: { text: "@cocoa-discord/music-module test mode" },
});

if (!process.env.GUILD_ID) {
  throw new Error("GUILD_ID is not set");
}

const center = new SlashCenter(client, [process.env.GUILD_ID]);
center.addModules(new Music(client, style));
center.useHelpCommand(style);
center.on("error", async (name, err, ctx) => {
  await ctx.channel?.send(`Error ${err}`);
  await client.destroy();

  // * FOR DEBUG PURPOSES ONLY, Don't do this on production
  setTimeout(() => {
    throw err;
  }, 10);
});

client.on("ready", (cli) => {
  console.log(`Logged in as ${cli.user.tag}`);
  center.syncCommands();
});

new ConsoleManager().useLogout(client);
checkLogin(client, process.env.DISCORD_TOKEN);
