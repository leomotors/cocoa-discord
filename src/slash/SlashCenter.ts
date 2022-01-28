import chalk from "chalk";
import { Client, CommandInteraction, Interaction } from "discord.js";

import { CogSlashClass } from "./class";
import { CogSlash } from "./Interfaces";
import { Awaitable, ManagementCenter } from "../shared";
import { syncCommands } from "./SlashSync";

export interface SlashEvents {
    error: (error: unknown, ctx: CommandInteraction) => Awaitable<void>;
}

export class SlashCenter extends ManagementCenter<
    CogSlash,
    CogSlashClass,
    SlashEvents
> {
    private readonly guild_ids: string[];

    constructor(client: Client, guild_ids: string[]) {
        super(client, { error: [] });
        this.guild_ids = guild_ids;

        this.client.on(
            "interactionCreate",
            ((interaction: Interaction) => {
                if (!interaction.isCommand()) return;

                this.handleInteraction(interaction);
            }).bind(this)
        );
    }

    /** Sync Slash Commands, Call this **ONLY** after client is ready */
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
                    if (this.hasHandler("error"))
                        await this.runAllHandler("error", error, interaction);
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
}
