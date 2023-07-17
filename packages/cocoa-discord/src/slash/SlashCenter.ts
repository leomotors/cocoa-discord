import {
  ApplicationCommandOptionType,
  ChatInputCommandInteraction,
  Client,
  Interaction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

import chalk from "chalk";

import { Awaitable, ManagementCenter } from "../base/index.js";
import { EmbedStyle } from "../main/index.js";
import {
  CocoaBuilderFull,
  CocoaOption,
  Ephemeral,
  getEphemeral,
} from "../template/index.js";

import { CogSlashClass, replaceNameKeyword } from "./class/index.js";
import { CommandsPack, syncCommands } from "./SlashSync.js";
import { CocoaSlash, CogSlash, GlobalCommand } from "./types.js";

export interface SlashEvents {
  error: (
    name: string,
    error: unknown,
    ctx: ChatInputCommandInteraction,
  ) => Awaitable<void>;
  interaction: (
    name: string,
    ctx: ChatInputCommandInteraction,
  ) => Awaitable<void>;
}

export class SlashCenter extends ManagementCenter<
  CogSlash,
  CogSlashClass,
  SlashEvents
> {
  /**
   * @param client It is what it is
   * @param guild_ids Array of Guild IDs, will *throw error* if is `undefined`, use "Global" if you are registering Global Command
   */
  constructor(client: Client, guild_ids: string[] | undefined | GlobalCommand) {
    super(client, "Slash", { error: [], interaction: [] }, guild_ids);

    if (!guild_ids || guild_ids.length < 1) throw Error("guild_ids not exist");
    this.guild_ids = guild_ids;

    this.client.on("interactionCreate", (interaction: Interaction) => {
      if (!interaction.isChatInputCommand()) return;

      this.handleInteraction(interaction);
    });
  }

  override async validateCommands() {
    await Promise.all(this.cogs.map((cog) => cog.presync?.()));
    if (this.useHelp) this._useHelpCommand(this.helpStyle);
    await super.validateCommands();
  }

  private async buildCommandsPack() {
    const guildIdsSet = new Set<string>(
      this.guild_ids === GlobalCommand ? [] : this.guild_ids!,
    );

    const commandData: CommandsPack[] = [];
    for (const cog of this.cogs) {
      for (const [_, command] of Object.entries(cog.commands)) {
        if (command.command.name === replaceNameKeyword) {
          throw "You cannot use AutoBuilder with Object Cog";
        }

        if (command.guild_ids !== GlobalCommand)
          command.guild_ids?.forEach((id) => guildIdsSet.add(id));

        commandData.push([
          command.command,
          command.guild_ids ?? this.guild_ids!,
        ]);
      }
    }

    return { guildIdsSet, commandData };
  }

  /** Sync Slash Commands, Call this **ONLY** after client is ready */
  async syncCommands(verbose = false) {
    if (!this.client.isReady()) {
      throw Error(
        "FATAL ERROR: SyncCommands must be called after Client is Ready",
      );
    }

    if (!this.validated)
      throw new Error(
        "Validate command by either calling this.validateCommands() or using checkLogin()",
      );

    const { commandData, guildIdsSet } = await this.buildCommandsPack();

    await syncCommands(commandData, this.client, [...guildIdsSet], verbose);
  }

  private async handleInteraction(interaction: ChatInputCommandInteraction) {
    const cmdname = interaction.commandName;

    for (const cog of this.cogs) {
      if (cog.commands[cmdname]) {
        try {
          await cog.commands[cmdname]!.func(interaction);
          if (this.hasHandler("interaction"))
            await this.runAllHandler("interaction", cmdname, interaction);
        } catch (error) {
          console.log(
            chalk.red(`[Slash Command: ${cmdname} ERROR] : ${error}`),
          );
          if (this.hasHandler("error"))
            await this.runAllHandler("error", cmdname, error, interaction);
        }
        return;
      }
    }
    console.log(chalk.red(`[Slash Center ERROR]: Unknown command ${cmdname}`));
  }

  private useHelp = false;
  private helpStyle?: EmbedStyle;

  override useHelpCommand(style?: EmbedStyle) {
    this.helpStyle = style;
    this.useHelp = true;
  }

  private _useHelpCommand(style?: EmbedStyle) {
    this.validated = false;
    const allEmb = this.generateHelpCommandAsEmbed();

    this.addCogs({
      name: "Help",
      commands: {
        help: {
          command: CocoaBuilderFull("help", "Show help for all commands")
            .addStringOption(
              CocoaOption("command", "Command name to get detailed help"),
            )
            .addBooleanOption(Ephemeral())
            .toJSON(),
          func: async (ctx) => {
            const command = ctx.options.getString("command");
            const emb = command
              ? this.commandHelp(command, ctx, style)
              : style
              ? style.apply(ctx, allEmb)
              : allEmb;
            const ephemeral = getEphemeral(ctx);
            await ctx.reply({
              embeds: [emb],
              ephemeral,
            });
          },
          guild_ids: this.unionAllGuildIds<true>(),
        },
      },
    });
  }

  private commandHelp(
    command: string,
    ctx: ChatInputCommandInteraction,
    style = new EmbedStyle({}),
  ) {
    const cmd = this.getAllCommands().find(
      (cmd) => cmd.command.name === command,
    ) as CocoaSlash & {
      command: RESTPostAPIChatInputApplicationCommandsJSONBody;
    };

    if (!cmd) {
      return style.use(ctx).setTitle(`Error: Command ${command} not found`);
    }

    return style
      .use(ctx)
      .setTitle(`Help for Slash Command: ${command}`)
      .setDescription(
        `${cmd.command.description}${
          cmd.long_description ? `\n\n${cmd.long_description}` : ""
        }\n\n${
          cmd.command.options
            ?.map(
              (opt) =>
                `${opt.name} (${ApplicationCommandOptionType[opt.type]}): ${
                  opt.description
                }${opt.required ? " **REQUIRED**" : ""}`,
            )
            .join("\n") ?? ""
        }`,
      );
  }
}
