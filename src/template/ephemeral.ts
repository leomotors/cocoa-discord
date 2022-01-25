/**
 * Usage:
 * ```js
 * new SlashCommandBuilder().addBooleanOption(ephemeral(description, name))
 * ```
 * Description and Name are optional, specify them to override default
 */
export function ephemeral(
    description = "Make your request ephemeral",
    name = "ephemeral"
) {
    // @ts-ignore @discordjs/builders internal type
    return (option) =>
        option.setName(name).setDescription(description).setRequired(false);
}
