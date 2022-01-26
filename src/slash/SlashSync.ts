import chalk from "chalk";
import {
    ApplicationCommand,
    ApplicationCommandData,
    ApplicationCommandDataResolvable,
    ChatInputApplicationCommandData,
    Client,
    Guild,
} from "discord.js";

type CAC = ChatInputApplicationCommandData;

export async function syncCommands(
    commands: ApplicationCommandDataResolvable[],
    client: Client<true>,
    guild_ids: string[]
) {
    const futures = [];
    for (const guild_id of guild_ids) {
        const guild = client.guilds.cache.get(guild_id);
        if (guild) {
            futures.push(syncGuild(commands, client, guild));
        } else {
            console.log(
                chalk.yellow(
                    `[Slash Sync WARN]: Guild ${guild_id} not found, please confirm the guild ids, permissions and make sure this function is called after the client is ready.`
                )
            );
        }
    }

    for (const future of futures) {
        await future;
    }
}

async function syncGuild(
    commands: ApplicationCommandDataResolvable[],
    client: Client,
    guild: Guild
) {
    // * Modified From https://github.com/Androz2091/discord-sync-commands
    try {
        const start = new Date().getTime();
        console.log(`[Slash Sync] Begin syncing commands for ${guild.name}`);
        const currentCommands = await client.application!.commands.fetch({
            guildId: guild.id,
        })!;

        const newCommands = commands.filter(
            (command) => !currentCommands.some((c) => c.name === command.name)
        );
        for (let newCommand of newCommands) {
            await client.application!.commands.create(newCommand, guild.id);
        }

        const deletedCommands = currentCommands
            .filter((command) => !commands.some((c) => c.name === command.name))
            .toJSON();
        for (let deletedCommand of deletedCommands) {
            await deletedCommand.delete();
        }

        const updatedCommands = commands.filter((command) =>
            currentCommands.some((c) => c.name === command.name)
        );

        for (let updatedCommand of updatedCommands) {
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
                } finished, used ${Math.round(new Date().getTime() - start)} ms`
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
