import {
  ApplicationCommandData,
  ChatInputApplicationCommandData,
  Client,
  Guild,
  RESTPostAPIApplicationCommandsJSONBody,
} from "discord.js";

import chalk from "chalk";

import { getElapsed } from "../meta/index.js";

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
  verbose = false,
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
          verbose,
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
        verbose,
      ),
    );
  }

  await Promise.all(futures);
}

async function syncGuild(
  commands: RESTPostAPIApplicationCommandsJSONBody[],
  client: Client<true>,
  guild: Guild | null,
  verbose = true,
) {
  // * Modified From https://github.com/Androz2091/discord-sync-commands

  const guildName = guild?.name ?? chalk.magenta("Application");

  try {
    const fetchCount = {
      created: 0,
      deleted: 0,
      updated: 0,
    };

    const start = new Date().getTime();

    console.log(
      `[Slash Sync] Begin syncing commands for ${guildName} (${commands.length} commands)`,
    );

    const currentCommands = await client.application.commands.fetch({
      guildId: guild?.id,
    })!;

    const newCommands = commands.filter(
      (command) => !currentCommands.some((c) => c.name === command.name),
    );
    for (const newCommand of newCommands) {
      fetchCount.created++;
      if (verbose)
        console.log(
          `[Slash Sync VERBOSE] Created ${newCommand.name} in ${guildName}`,
        );
      await client.application.commands.create(newCommand, guild?.id);
    }

    const deletedCommands = currentCommands
      .filter((command) => !commands.some((c) => c.name === command.name))
      .toJSON();
    for (const deletedCommand of deletedCommands) {
      fetchCount.deleted++;
      if (verbose)
        console.log(
          `[Slash Sync VERBOSE] Deleted ${deletedCommand.name} in ${guildName}`,
        );
      await deletedCommand.delete();
    }

    const updatedCommands = commands.filter((command) =>
      currentCommands.some((c) => c.name === command.name),
    );

    for (const updatedCommand of updatedCommands) {
      const newCommand = updatedCommand;
      const previousCommand = currentCommands.find(
        (c) => c.name === updatedCommand.name,
      )!;

      let modified = false;

      if (
        previousCommand.description !==
        (newCommand as ChatInputApplicationCommandData).description
      ) {
        modified = true;
      }

      if (
        modified ||
        !isSameOption(previousCommand.options, newCommand.options)
      ) {
        modified = true;
      }

      if (modified) {
        fetchCount.updated++;
        if (verbose) {
          console.log(
            `[Slash Sync VERBOSE] Updated ${previousCommand.name} in ${guildName}`,
          );
        }

        await previousCommand.edit(newCommand as ApplicationCommandData);
      }
    }

    console.log(
      chalk.green(
        `[Slash Sync DONE]: Syncing commands in ${guildName} finished, used ${getElapsed(
          start,
        )} ms, CDU = ${fetchCount.created},${fetchCount.deleted},${
          fetchCount.updated
        }`,
      ),
    );
  } catch (error) {
    console.log(
      chalk.red(
        `[Slash Sync ERROR]: Failed to sync ${guildName} with error ${error}`,
      ),
    );
  }
}

export interface IOptionCheck {
  name: string;
  description: string;
  type: number;
  required?: boolean;
  autocomplete?: boolean;
  choices?: Array<{ name: string; value: string | number }>;
}

/**
 * Logic use by Slash Sync to check if the options are the same
 */
export function isSameOption(
  oldOpt: IOptionCheck[] | undefined,
  newOpt: IOptionCheck[] | undefined,
) {
  oldOpt ??= [];
  newOpt ??= [];

  if (oldOpt.length !== newOpt.length) {
    return false;
  }

  for (let index = 0; index < oldOpt.length; index++) {
    const a = oldOpt[index]!;
    const b = newOpt[index]!;

    if (a.name !== b.name) return false;
    if (a.description !== b.description) return false;
    if (a.type !== b.type) return false;
    if ((a.required ?? false) !== (b.required ?? false)) return false;
    if ((a.autocomplete ?? false) !== (b.autocomplete ?? false)) return false;

    if (a.choices?.length) {
      if (a.choices?.length !== b.choices?.length) {
        return false;
      }

      for (let i = 0; i < a.choices.length; i++) {
        if (
          a.choices[i]!.name !== b.choices[i]!.name ||
          a.choices[i]!.value !== b.choices[i]!.value
        ) {
          return false;
        }
      }
    }
  }

  return true;
}
