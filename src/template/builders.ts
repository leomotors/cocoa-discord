/* eslint-disable @typescript-eslint/no-explicit-any */
import { SlashCommandBuilder } from "@discordjs/builders";

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
 * new SlashCommandBuilder().addStringOption(CocoaOption("url", "URL of Song"));
 * ```
 * The goal of this function is to shorten the redundant code.
 *
 * description and required are optional, `required` is default is `false`
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
 * new SlashCommandBuilder().addBooleanOption(ephemeral(description, name));
 * ```
 * The goal of this function is to shorten the redundant code.
 *
 * Description and Name are optional, specify them to override default
 */
export function ephemeral(
    description = "Make your request ephemeral",
    name = "ephemeral"
) {
    return (option: any) =>
        option.setName(name).setDescription(description).setRequired(false);
}
