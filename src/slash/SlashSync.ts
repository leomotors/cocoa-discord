import chalk from "chalk";
import {
    ApplicationCommand,
    ApplicationCommandData,
    ChatInputApplicationCommandData,
    Client,
    Guild,
} from "discord.js";

type CAC = ChatInputApplicationCommandData;

export async function syncCommands(
    commands: ApplicationCommandData[],
    client: Client,
    guild_ids: string[]
) {
    const futures = [];
    for (const guild_id of guild_ids) {
        const guild = client.guilds.cache.get(guild_id);
        if (guild) {
            futures.push(syncGuild(commands, client, guild));
        } else {
            console.log(
                chalk.yellow(`[Slash Sync WARN]: Guild ${guild_id} not found`)
            );
        }
    }

    for (const future of futures) {
        await future;
    }
}

async function syncGuild(
    commands: ApplicationCommandData[],
    client: Client,
    guild: Guild
) {
    // * Modified From https://github.com/Androz2091/discord-sync-commands
    try {
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
                await previousCommand.edit(newCommand);
            }
        }

        console.log(`[Slash Sync DONE]: ${guild.name}`);
    } catch (error) {
        console.log(
            chalk.red(
                `[Slash Sync ERROR]: Failed to sync ${guild.name} with error ${error}`
            )
        );
    }
}

// temp
import { Intents } from "discord.js";
const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGE_REACTIONS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.DIRECT_MESSAGE_REACTIONS,
    ],
});

const guild = client.guilds.cache.get("827812873363128351");
guild?.commands.create({
    name: "test",
    description: "Start Netflix",
});

syncCommands(
    [
        {
            name: "test",
            description: "Start Netflix",
        },
    ],
    client,
    ["827812873363128351"]
);
