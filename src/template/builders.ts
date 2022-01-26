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
