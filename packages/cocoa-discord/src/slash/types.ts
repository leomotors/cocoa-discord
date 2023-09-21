import {
  ChatInputCommandInteraction,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

import { Awaitable, Module } from "../base/index.js";

export const GlobalCommand = "Global";
export type GlobalCommand = typeof GlobalCommand;

/** This interface represent a single slash command */
export interface CocoaSlash {
  command: RESTPostAPIApplicationCommandsJSONBody;
  func: (interaction: ChatInputCommandInteraction) => Promise<void>;
  guild_ids?: string[] | GlobalCommand;
  long_description?: string;
}

export interface SlashModule extends Module<CocoaSlash> {
  /** This hook should only be handled internally */
  presync?: () => Awaitable<void>;
}
