import "dotenv/config";

import {
    ActivityGroupLoader,
    ActivityManager,
    checkLogin,
    Cocoa,
} from "cocoa-discord-utils";
import { SlashCenter } from "cocoa-discord-utils/slash";
import { CocoaIntent } from "cocoa-discord-utils/template";

import { Client } from "discord.js";

import { MainCog, style } from "./commands/styles";
import { GuildIds } from "./environment";

const client = new Client(new CocoaIntent().useGuildSlash());
const center = new SlashCenter(client, GuildIds);

// ? Edit data/activites.json to customize, or delete this line to not use activities
const activity = new ActivityGroupLoader("data/activities.json");

center.addCogs(new MainCog());
center.useHelpCommand(style);
center.on("error", async (name, err, ctx) => {
    Cocoa.log(
        `Command ${name} invoked by ${ctx.user.tag} encounter error at ${ctx.guild?.name}: ${err}`
    );
    await ctx.channel?.send(`Sorry, error occured: ${err}`);
});

const activityManager = new ActivityManager(activity, client);

client.on("ready", (cli) => {
    console.log(
        `Logged in as ${cli.user.tag}, took ${process
            .uptime()
            .toFixed(3)} seconds`
    );
    center.syncCommands(true);
    activityManager.nextActivity();
});

checkLogin(client, process.env.DISCORD_TOKEN);
