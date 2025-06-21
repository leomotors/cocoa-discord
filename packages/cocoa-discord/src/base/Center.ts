import chalk from "chalk";
import { Client, EmbedBuilder } from "discord.js";

import { EmbedStyle } from "../main/index.js";
import { MessageEvents } from "../message/index.js";
import { SlashEvents } from "../slash/index.js";
import { GlobalCommand } from "../slash/types.js";
import { store } from "./store.js";
import { BaseCommand, Module as BaseModule, NonEmptyArray } from "./types.js";

export abstract class ManagementCenter<
  Module extends BaseModule<BaseCommand>,
  ModuleClass extends Module,
  Events = MessageEvents | SlashEvents,
> {
  protected readonly client: Client;
  protected modules: Module[] = [];
  protected validated = false;
  protected guild_ids?: string[] | GlobalCommand;

  helpText = "";
  helpEmbed?: EmbedBuilder;

  private centerType: "Message" | "Slash";

  constructor(
    client: Client,
    centerType: "Message" | "Slash",
    protected eventHandler: {
      [event in keyof Events]: Events[event][];
    },
    guild_ids?: string[] | GlobalCommand,
  ) {
    this.client = client;
    this.centerType = centerType;
    this.guild_ids = guild_ids;

    store.subscribe("login", this.validateCommands.bind(this));
  }

  addModules(...modules: NonEmptyArray<Module | ModuleClass>) {
    this.validated = false;
    this.modules.push(...modules);
  }

  on<T extends keyof Events>(event: T, callback: Events[T]) {
    this.eventHandler[event].push(callback);
  }

  protected hasHandler(event: keyof Events) {
    return this.eventHandler[event].length > 0;
  }

  protected async runAllHandler<T extends keyof Events>(
    event: T,
    // @ts-expect-error too complicated
    ...args: Parameters<Events[T]>
  ) {
    const futures = [];
    for (const handler of this.eventHandler[event])
      futures.push(
        (async () => {
          try {
            // @ts-expect-error too complicated
            await handler(...args);
          } catch (error) {
            console.log(chalk.red(`[Event Handler ERROR]: ${error}`));
          }
        })(),
      );
    await Promise.all(futures);
  }

  /**
   * Generate Cog that contains Help Command
   *
   * Should be called **after** all cogs are added and **before** commands validation.
   *
   * Make sure to **NOT** name any cog `Help` or any command `help`
   */
  useHelpCommand(_?: EmbedStyle) {
    throw "ManagementCenter is Abstract class but this method is called";
  }

  /**
   * No multiple Cogs or commands should have same name,
   * and `Cog.commands` key and value must be the same command name
   *
   * This function will ensure that and should be called after all cogs are added
   *
   * **Note**: It is recommended to use `checkLogin()` instead for simplicity
   */
  async validateCommands() {
    if (this.validated)
      console.log(
        chalk.yellow(`[WARN ${this.centerType} Center] Already Validated!`),
      );

    const moduleNames = [];
    const cmdNames = [];
    for (const mod of this.modules) {
      moduleNames.push(mod.name);
      for (const [name, cmd] of Object.entries(mod.commands)) {
        cmdNames.push(name);
        if (name !== cmd.command.name) throw Error("Command name mismatch");
      }
    }

    if (new Set(moduleNames).size !== moduleNames.length)
      throw Error("Duplicate Module names");

    if (new Set(cmdNames).size !== cmdNames.length) {
      throw Error("Duplicate Command names");
    }

    this.validated = true;
  }

  protected generateHelpCommand() {
    if (this.helpText) return this.helpText;

    for (const mod of this.modules) {
      this.helpText += `<== **${mod.name}${
        mod.description ? ` - ${mod.description}` : ""
      }** ==>\n`;

      for (const [_, command] of Object.entries(mod.commands)) {
        const cmd = command.command;
        this.helpText += `${cmd.name}${
          cmd.description ? ` - ${cmd.description}` : ""
        }\n`;
      }
    }

    return this.helpText;
  }

  protected generateHelpCommandAsEmbed() {
    if (this.helpEmbed) return this.helpEmbed;

    this.generateHelpCommand();

    this.helpEmbed = new EmbedBuilder()
      .setTitle(`Help for ${this.centerType} Command`)
      .setDescription(this.helpText);

    return this.helpEmbed;
  }

  protected unionAllGuildIds<
    HasGlobal extends boolean = false,
  >(): HasGlobal extends true ? string[] | GlobalCommand : string[] {
    if (this.guild_ids === GlobalCommand)
      return GlobalCommand as unknown as string[];

    const guildIds = new Set<string>(this.guild_ids ?? []);

    for (const mod of this.modules) {
      for (const [_, cmd] of Object.entries(mod.commands)) {
        if (cmd.guild_ids === GlobalCommand)
          return GlobalCommand as unknown as string[];

        (cmd.guild_ids ?? []).forEach((guildId) => guildIds.add(guildId));
      }
    }

    return [...guildIds];
  }

  protected allCommands?: BaseCommand[];
  protected getAllCommands() {
    return (this.allCommands ??= this.modules.reduce<BaseCommand[]>(
      (prev, curr) => prev.concat(Object.values(curr.commands)),
      [],
    ));
  }
}
