// @ts-check
import "dotenv/config";

import { ConsoleManager, EmbedStyle, checkLogin } from "cocoa-discord";
import { SlashCenter } from "cocoa-discord/slash";
import { CocoaIntent } from "cocoa-discord/template";

import { Client } from "discord.js";

// import { Music } from "@leomotors/music-bot"
import { Music } from "../dist/index.js";

// * A simple discord bot to E2E (manually) test this cog module
// * Also minimum code required to fire the bot
// * Good Example!

const client = new Client(new CocoaIntent().useGuild().useGuildVoice());
const style = new EmbedStyle({
  author: "invoker",
  color: 0xd7f6fc,
  footer: { text: "@leomotors/music-bot test mode" },
});

const center = new SlashCenter(client, process.env.GUILD_IDS?.split(","));
center.addModules(new Music(client, style));
center.useHelpCommand(style);
center.on("error", (name, err, ctx) => {
  // * FOR DEBUG PURPOSES ONLY, Don't do this on production
  client.destroy();
  setTimeout(() => {
    throw err;
  }, 100);

  // * Note: What you should do on Production
  // await ctx.channel?.send(`Error ${err}`);
});

client.on("ready", (cli) => {
  console.log(`Logged in as ${cli.user.tag}`);
  center.syncCommands();
});

new ConsoleManager().useLogout(client);
checkLogin(client, process.env.DISCORD_TOKEN);
