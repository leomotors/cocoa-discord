import {
  ApplicationCommandOptionType,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

import { MyBuilder } from "./builder.js";

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
    command: (builder: MyBuilder) => MyBuilder<T>,
    handler: (
      ctx: ChatInputCommandInteraction,
      data: {
        [o in keyof T]: T[o];
      },
    ) => unknown,
  ) {
    const builder = command(new MyBuilder()).builder;

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
      if (option.type === ApplicationCommandOptionType.String) {
        const value = ctx.options.getString(option.name);
        data[option.name] = value;
        return;
      }

      if (option.type === ApplicationCommandOptionType.Integer) {
        const value = ctx.options.getInteger(option.name);
        data[option.name] = value;
        return;
      }
    });

    await handler(ctx, data);
  }
}
