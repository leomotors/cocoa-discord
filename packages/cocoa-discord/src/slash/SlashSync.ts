import {
  Client,
  Guild,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

import chalk from "chalk";

import { GlobalCommand } from "./types.js";

/**
 * Represent the Command Data (discord.js-compatible interface)
 * and list of guilds to sync to
 */
export type CommandsPack = [
  RESTPostAPIApplicationCommandsJSONBody,
  string[] | GlobalCommand,
];

/** @internal Should not be used */
export async function syncCommands(
  commands: CommandsPack[],
  client: Client,
  guild_ids: string[],
) {
  if (!client.isReady()) {
    console.log(
      chalk.red(
        "[Slash Sync FAIL] This function must be called after Client is ready",
      ),
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
          guild,
        ),
      );
    } else {
      console.log(
        chalk.yellow(
          `[Slash Sync WARN]: Guild ${guild_id} not found, please confirm the guild ids, permissions and make sure this function is called after the client is ready.`,
        ),
      );
    }
  }

  const globalCommands = commands.filter((pack) => pack[1] === GlobalCommand);
  if (globalCommands.length) {
    futures.push(
      syncGuild(
        globalCommands.map((pack) => pack[0]),
        client,
        null,
      ),
    );
  }

  await Promise.all(futures);
}

async function syncGuild(
  commands: RESTPostAPIApplicationCommandsJSONBody[],
  client: Client<true>,
  guild: Guild | null,
) {
  // * Modified From https://github.com/Androz2091/discord-sync-commands

  const guildName = guild?.name ?? chalk.magenta("Application");

  if (guild) {
    guild.commands.set(commands);
  } else {
    client.application.commands.set(commands);
  }

  console.log(
    `[Slash Sync] Finished syncing for ${guildName} (${commands.length} commands set)`,
  );
}
