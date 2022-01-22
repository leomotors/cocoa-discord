import chalk from "chalk";
import { Client, CommandInteraction, Interaction } from "discord.js";
import { Cog } from "./Interfaces";
import { syncCommands } from "./SlashSync";

export class SlashCenter {
    private readonly client: Client;
    private readonly guild_ids: string[];
    private cogs: Cog[] = [];

    constructor(client: Client, guild_ids: string[]) {
        this.client = client;
        this.guild_ids = guild_ids;

        this.client.on(
            "interactionCreate",
            ((interaction: Interaction) => {
                if (!interaction.isCommand()) return;

                this.handleInteraction(interaction);
            }).bind(this)
        );
    }

    addCog(cog: Cog) {
        this.cogs.push(cog);
    }

    async syncCommands() {
        const commandData = [];
        for (const cog of this.cogs) {
            for (const commandName in cog.commands) {
                const command = cog.commands[commandName];
                commandData.push(command.command);
            }
        }

        await syncCommands(commandData, this.client, this.guild_ids);
    }

    private async handleInteraction(interaction: CommandInteraction) {
        const cmdname = interaction.commandName;
        for (const cog of this.cogs) {
            if (cog.commands[cmdname]) {
                cog.commands[cmdname].func(interaction);
                return;
            }
        }
        console.log(
            chalk.red(`[Slash Center ERROR]: Unknown command ${cmdname}`)
        );
    }
}
