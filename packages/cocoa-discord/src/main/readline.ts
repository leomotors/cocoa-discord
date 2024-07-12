import { Client } from "discord.js";

import readline from "node:readline";

import chalk from "chalk";

import { Awaitable } from "../base/index.js";

import { Loader } from "./loader.js";

let rl: readline.Interface;

/**
 * @returns Get readline interface used by `setConsoleEvent` and `ConsoleManager`.
 * To prevent creating more than one interface in a program.
 */
export function getReadlineInterface() {
  if (!rl)
    rl = readline.createInterface({
      // @ts-expect-error it works, trust me
      input: process.stdin,
      output: process.stdout,
    });

  return rl;
}

/**
 * For compatibility with other library, you can force `setConsoleEvent`
 * and `ConsoleManager` to use your interface.
 *
 * You **must** call this function before `setConsoleEvent` and `ConsoleManager`!
 */
export function setReadlineInterface(int: readline.Interface) {
  if (rl) {
    console.log(
      chalk.yellow("WARNING: Readline Interface is already created!"),
    );
  }

  rl = int;
}

// #region setConsoleEvent
/**
 * On Enter in Console
 *
 * *The full implementation*
 *
 * ```ts
 * export function setConsoleEvent(handler: (cmd: string) => void) {
 * rl.on("line", (cmd: string) => {
 *     handler(cmd);
 *  });
 * }
 * ```
 */
export function setConsoleEvent(handler: (cmd: string) => void) {
  getReadlineInterface().on("line", (cmd: string) => {
    handler(cmd);
  });
}
// #endregion setConsoleEvent

export type ConsoleFunction = (arg: string) => Awaitable<void>;

/**
 * Recommended Usage: Your bot should always logout properly
 *
 * ```js
 * const Console = new ConsoleManager();
 * Console.useLogout(client).useReload(myLoader, ...);
 * ```
 *
 * Now, if you type logout in console, the bot will logout properly.
 *
 * You can also use predefined `useReload` to reload the Loaders
 */
export class ConsoleManager {
  private commands: { [name: string]: ConsoleFunction } = {};

  constructor() {
    getReadlineInterface().on("line", this.handleCommands.bind(this));
  }

  private async handleCommands(cmd: string) {
    cmd = cmd.trim();

    const tokens = cmd.split(" ");
    const cmdf = this.commands[tokens[0]!];
    if (cmdf) {
      await cmdf(tokens.slice(1).join(" ").trim());
      return;
    }

    console.log(chalk.yellow(`[Console WARN] Unknown Command ${tokens[0]}`));
  }

  /**
   * Command is first word of the line.
   *
   * **Command Name is unique**, this function *will throw error* if duplicate
   * commands with same name are added.
   *  */
  addCommand(name: string, callback: ConsoleFunction) {
    if (this.commands[name]) throw `${name} already exist!`;

    this.commands[name] = callback;
    return this;
  }

  /** Template Command for Logging out */
  useLogout(...clients: Client[]) {
    this.addCommand("logout", () => {
      clients.map((cli) => cli.destroy());

      console.log(chalk.cyan("Logged out Successfully!"));
      process.exit(0);
    });
    return this;
  }

  /** Template Command for Reloading with Loaders */
  useReload(...loaders: Array<Loader<unknown> | (() => Awaitable<void>)>) {
    this.addCommand("reload", async () => {
      await Promise.all(
        loaders.map((lod) =>
          typeof lod === "function" ? lod() : lod.reload(),
        ),
      );
      console.log(chalk.green("Successfully reloaded all Loaders"));
    });
    return this;
  }
}
