import { EmbedStyle } from "cocoa-discord-utils";
import { SlashCenter } from "cocoa-discord-utils/slash";
import { CocoaOptions } from "cocoa-discord-utils/template";

import { Client } from "discord.js";

import { Music } from "../dist/index.js";

const client = new Client(CocoaOptions);
const style = new EmbedStyle({});

// * Test if initialization can be done without error
// * Will be run with GitHub Actions
async function test() {
  const music = new Music(client, style);
  const scenter = new SlashCenter(client, ["1234567890"]);
  scenter.addCog(music);
  scenter.useHelpCommand(style);
  await scenter.validateCommands();
}

test();
