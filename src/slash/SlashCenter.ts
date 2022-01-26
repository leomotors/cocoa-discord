import chalk from "chalk";
import { Client, CommandInteraction, Interaction } from "discord.js";

import { CogClass } from "./class";
import { Cog } from "./Interfaces";
import { NonEmptyArray } from "../shared";
import { syncCommands } from "./SlashSync";

export class SlashCenter {
    private readonly client: Client;
    private readonly guild_ids: string[];
    private cogs: Cog[] = [];
    private validated = false;

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

    addCog(cog: Cog | CogClass) {
        this.cogs.push(cog);
    }

    addCogs(...cogs: NonEmptyArray<Cog | CogClass>) {
        this.cogs.push(...cogs);
    }

    /**
     * Sync Slash Commands, Call this **ONLY** after client is ready
     */
    async syncCommands() {
        if (!this.client.isReady()) {
            throw Error(
                "FATAL ERROR: SyncCommands must be called after Client is Ready"
            );
        }

        if (!this.validated)
            console.log(
                chalk.yellow(
                    "[Slash Center WARN]: Please validate command using .validateCommands() before syncing"
                )
            );

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
                try {
                    await cog.commands[cmdname].func(interaction);
                } catch (error) {
                    console.log(
                        chalk.red(
                            `[Slash Command: ${cmdname} ERROR] : ${error}`
                        )
                    );
                }
                return;
            }
        }
        console.log(
            chalk.red(`[Slash Center ERROR]: Unknown command ${cmdname}`)
        );
    }

    /**
     * No multiple Cogs or commands should have same name,
     * and `Cog.commands` key and value must be the same command name
     *
     * This function will ensure that and should be called after all cogs are added
     * and **before** syncing slash commands
     */
    validateCommands() {
        const cogNames = [];
        const cmdNames = [];
        for (const cog of this.cogs) {
            cogNames.push(cog.name);
            if (cog instanceof CogClass) continue;
            for (const [name, cmd] of Object.entries(cog.commands)) {
                cmdNames.push(name);
                if (name != cmd.command.name)
                    throw Error("Command name mismatch");
            }
        }

        if (new Set(cogNames).size !== cogNames.length) {
            throw Error("Duplicate cog names");
        }

        if (new Set(cmdNames).size !== cmdNames.length) {
            throw Error("Duplicate command names");
        }

        this.validated = true;
    }
}
