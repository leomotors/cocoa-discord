import chalk from "chalk";
import {
    ApplicationCommand,
    ApplicationCommandData,
    ApplicationCommandDataResolvable,
    ChatInputApplicationCommandData,
    Client,
    Guild,
} from "discord.js";

import { getElapsed } from "../meta";

type CAC = ChatInputApplicationCommandData;

export type CommandsPack = [ApplicationCommandDataResolvable, string[]];

export async function syncCommands(
    commands: CommandsPack[],
    client: Client,
    guild_ids: string[]
) {
    if (!client.isReady()) {
        console.log(
            chalk.red(
                "[Slash Sync FAIL] This function must be called after Client is ready"
            )
        );
        return;
    }

    const futures = [];
    for (const guild_id of guild_ids) {
        const guild = client.guilds.cache.get(guild_id);
        if (guild) {
            const usable = commands.filter((pack) => {
                return pack[1].includes(guild_id);
            });
            futures.push(
                syncGuild(
                    usable.map((pack) => pack[0]),
                    client,
                    guild
                )
            );
        } else {
            console.log(
                chalk.yellow(
                    `[Slash Sync WARN]: Guild ${guild_id} not found, please confirm the guild ids, permissions and make sure this function is called after the client is ready.`
                )
            );
        }
    }
    await Promise.all(futures);
}

async function syncGuild(
    commands: ApplicationCommandDataResolvable[],
    client: Client<true>,
    guild: Guild
) {
    // * Modified From https://github.com/Androz2091/discord-sync-commands
    try {
        const start = new Date().getTime();
        console.log(
            `[Slash Sync] Begin syncing commands for ${guild.name} (${commands.length} commands)`
        );
        const currentCommands = await client.application.commands.fetch({
            guildId: guild.id,
        })!;

        const newCommands = commands.filter(
            (command) => !currentCommands.some((c) => c.name === command.name)
        );
        for (const newCommand of newCommands) {
            await client.application.commands.create(newCommand, guild.id);
        }

        const deletedCommands = currentCommands
            .filter((command) => !commands.some((c) => c.name === command.name))
            .toJSON();
        for (const deletedCommand of deletedCommands) {
            await deletedCommand.delete();
        }

        const updatedCommands = commands.filter((command) =>
            currentCommands.some((c) => c.name === command.name)
        );

        for (const updatedCommand of updatedCommands) {
            const newCommand = updatedCommand;
            const previousCommand = currentCommands.find(
                (c) => c.name === updatedCommand.name
            )!;

            let modified = false;

            if (previousCommand.description !== (newCommand as CAC).description)
                modified = true;

            if (
                !ApplicationCommand.optionsEqual(
                    previousCommand.options ?? [],
                    (newCommand as CAC).options ?? []
                )
            )
                modified = true;

            if (modified) {
                await previousCommand.edit(
                    newCommand as ApplicationCommandData
                );
            }
        }

        console.log(
            chalk.green(
                `[Slash Sync DONE]: Syncing commands in ${
                    guild.name
                } finished, used ${getElapsed(start)} ms`
            )
        );
    } catch (error) {
        console.log(
            chalk.red(
                `[Slash Sync ERROR]: Failed to sync ${guild.name} with error ${error}`
            )
        );
    }
}
