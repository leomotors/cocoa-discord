/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder } from "@discordjs/builders";

import { CommandInteraction } from "discord.js";

/**
 * Basically `SlashCommandBuilder` but with name and description
 * @returns SlashCommandBuilder with given name and description set
 */
export function CocoaBuilder(name: string, description?: string) {
    const c = new SlashCommandBuilder().setName(name);
    if (description) return c.setDescription(description);
    return c;
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
    required = false
) {
    if (description)
        return (option: any) =>
            option
                .setName(name)
                .setDescription(description)
                .setRequired(required);
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
    name = "ephemeral"
) {
    return (option: any) =>
        option.setName(name).setDescription(description).setRequired(false);
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
 * **Note**: As you can see, this function will retrieve the `ephemeral` options,
 * meaning that if you override the Ephemeral's name field, do not use this function!
 */
export function getEphemeral(ctx: CommandInteraction) {
    return ctx.options.getBoolean("ephemeral") ?? false;
}
