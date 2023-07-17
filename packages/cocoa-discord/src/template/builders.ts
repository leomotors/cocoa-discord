/* eslint-disable @typescript-eslint/no-explicit-any */
// Disable no-explicit-any because I'm too lazy to write all possible types
import { ChatInputCommandInteraction, SlashCommandBuilder } from "discord.js";

import { replaceNameKeyword } from "../slash/class/index.js";

/**
 * Basically `SlashCommandBuilder` but with name and description
 * @returns SlashCommandBuilder with given name and description set
 */
export function CocoaBuilderFull(name: string, description?: string) {
  const c = new SlashCommandBuilder().setName(name);
  if (description) c.setDescription(description);
  return c;
}

/**
 * **NOTE**: Only usable with `CogSlashClass`
 *
 * Like `CocoaBuilderFull` but you don't need to specify name.
 *
 * @returns SlashCommandBuilder with given description set
 */
export function CocoaBuilder(description?: string) {
  return CocoaBuilderFull(replaceNameKeyword, description);
}

/**
 * Usage:
 * ```js
 * CocoaBuilder().addStringOption(CocoaOption("url", "URL of Song"));
 * ```
 * The goal of this function is to shorten the redundant code.
 *
 * description and required are optional, `required` is default to `false`
 */
export function CocoaOption(
  name: string,
  description?: string,
  required = false,
) {
  if (description)
    return (option: any) =>
      option.setName(name).setDescription(description).setRequired(required);
  return (option: any) => option.setName(name).setRequired(required);
}

/**
 * Usage:
 * ```js
 * CocoaBuilder().addBooleanOption(ephemeral(description, name));
 * ```
 * The goal of this function is to shorten the redundant codes.
 *
 * Description and Name are optional, specify them to override default
 */
export function Ephemeral(
  description = "Make your request ephemeral",
  name = "ephemeral",
) {
  return CocoaOption(name, description, false);
}

/**
 * Yet another function for shorten the redundant codes.
 *
 * Usage:
 * ```js
 * const ephemeral = getEphemeral(ctx);
 * ```
 * Will expand to:
 * ```js
 * ctx.options.getBoolean("ephemeral") ?? false;
 * ```
 * **Note**: If you have override the `Ephemeral()` name's field,
 * pass that as the second argument to correctly retrieve parameters!
 */
export function getEphemeral(
  ctx: ChatInputCommandInteraction,
  override?: string,
) {
  return ctx.options.getBoolean(override ?? "ephemeral") ?? false;
}
