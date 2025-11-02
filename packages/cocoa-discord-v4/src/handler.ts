import {
  ApplicationCommandOptionType,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

import { TypedSlashBuilder } from "./builder.js";

export class SlashCommandHandler {
  private handlers: Map<
    string,
    {
      command:
        | ChatInputApplicationCommandData
        | RESTPostAPIChatInputApplicationCommandsJSONBody;
      handler: CallableFunction;
    }
  > = new Map();

  public getCommands() {
    return this.handlers
      .values()
      .map((entry) => entry.command)
      .toArray();
  }

  public hasCommand(name: string) {
    return this.handlers.has(name);
  }

  public addCommand<T extends Record<string, unknown>>(
    command: (builder: TypedSlashBuilder) => TypedSlashBuilder<T>,
    handler: (
      ctx: ChatInputCommandInteraction,
      data: {
        [Option in keyof T]: T[Option];
      },
    ) => unknown,
  ) {
    const builder = command(new TypedSlashBuilder()).builder;

    this.handlers.set(builder.name, {
      command: builder.toJSON(),
      handler,
    });

    return this;
  }

  public async handleInteraction(ctx: ChatInputCommandInteraction) {
    const entry = this.handlers.get(ctx.commandName);
    if (!entry) return;

    const { command, handler } = entry;

    const data = {} as Record<string, unknown>;

    command.options?.map(async (option) => {
      switch (option.type) {
        case ApplicationCommandOptionType.Attachment: {
          const value = ctx.options.getAttachment(option.name);
          data[option.name] = value;
          return;
        }
        case ApplicationCommandOptionType.Boolean: {
          const value = ctx.options.getBoolean(option.name);
          data[option.name] = value;
          return;
        }
        case ApplicationCommandOptionType.Channel: {
          const value = ctx.options.getChannel(option.name);
          data[option.name] = value;
          return;
        }
        case ApplicationCommandOptionType.Integer: {
          const value = ctx.options.getInteger(option.name);
          data[option.name] = value;
          return;
        }
        case ApplicationCommandOptionType.Mentionable: {
          const value = ctx.options.getMentionable(option.name);
          data[option.name] = value;
          return;
        }
        case ApplicationCommandOptionType.Number: {
          const value = ctx.options.getNumber(option.name);
          data[option.name] = value;
          return;
        }
        case ApplicationCommandOptionType.Role: {
          const value = ctx.options.getRole(option.name);
          data[option.name] = value;
          return;
        }
        case ApplicationCommandOptionType.String: {
          const value = ctx.options.getString(option.name);
          data[option.name] = value;
          return;
        }
        case ApplicationCommandOptionType.User: {
          const value = ctx.options.getUser(option.name);
          data[option.name] = value;
          return;
        }
      }
    });

    await handler(ctx, data);
  }
}
