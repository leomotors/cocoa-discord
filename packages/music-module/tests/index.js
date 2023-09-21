// @ts-check
import { EmbedStyle } from "cocoa-discord";
import { SlashCenter } from "cocoa-discord/slash";
import { CocoaIntent } from "cocoa-discord/template";

import { Client } from "discord.js";

import { Music } from "../dist/index.js";

const client = new Client(new CocoaIntent().useGuild().useGuildVoice());
const style = new EmbedStyle({});

// * Test if initialization can be done without error
// * Will be run with GitHub Actions
async function test() {
  const music = new Music(client, style);
  const scenter = new SlashCenter(client, ["1234567890"]);
  scenter.addCogs(music);
  scenter.useHelpCommand(style);
  await scenter.validateCommands();
}

test();
