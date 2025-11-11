import {
  ApplicationCommandOptionChoiceData,
  ApplicationCommandOptionType,
  AutocompleteInteraction,
  ChatInputApplicationCommandData,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

import { TypedSlashBuilder } from "./builder.js";

export type AutocompleteRespondVerifier<T extends string | number> = (
  options: readonly ApplicationCommandOptionChoiceData<T>[],
) => ApplicationCommandOptionChoiceData<T>[];

export type AutocompleteHandler<T extends string | number> = (
  ctx: AutocompleteInteraction,
  params: {
    value: T;
    verify: AutocompleteRespondVerifier<T>;
  },
) => unknown;

export class SlashCommandHandler {
  private handlers: Map<
    string,
    {
      command:
        | ChatInputApplicationCommandData
        | RESTPostAPIChatInputApplicationCommandsJSONBody;
      handler: CallableFunction;
      autocomplete?: Record<string, CallableFunction>;
    }
  > = new Map();

  public constructor(readonly name: string) {}

  public getCommands() {
    return this.handlers
      .values()
      .map((entry) => entry.command)
      .toArray();
  }

  public hasCommand(name: string) {
    return this.handlers.has(name);
  }

  public addCommand<
    T extends Record<string, unknown>,
    AC extends Record<string, unknown>,
  >(
    command: (builder: TypedSlashBuilder) => TypedSlashBuilder<T, AC>,
    handler: (
      ctx: ChatInputCommandInteraction,
      data: {
        [Option in keyof T]: T[Option];
      },
    ) => unknown,
    {
      autocomplete,
    }: {
      autocomplete?: {
        [Option in keyof AC]: (
          ctx: AutocompleteInteraction,
          params: {
            value: AC[Option];
            verify: AC[Option] extends string
              ? AutocompleteRespondVerifier<string>
              : AC[Option] extends number
                ? AutocompleteRespondVerifier<number>
                : never;
          },
        ) => unknown;
      };
    } = { autocomplete: undefined },
  ) {
    const builder = command(new TypedSlashBuilder()).builder;

    if (!handler.name) {
      Object.defineProperty(handler, "name", {
        value: `SlashHandler_${this.name}_${builder.name}`,
        writable: false,
      });
    }

    this.handlers.set(builder.name, {
      command: builder.toJSON(),
      handler,
      autocomplete,
    });

    return this;
  }

  /**
   * @returns `true` if command found and handled, `false` if command is not found.
   * Should always be `true` if you run {@link hasCommand} first.
   */
  public async handleCommandInteraction(ctx: ChatInputCommandInteraction) {
    const entry = this.handlers.get(ctx.commandName);
    if (!entry) return false;

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
    return true;
  }

  /**
   * @returns `true` if command found and handled, `false` if command is not found.
   * Should always be `true` if you run {@link hasCommand} first.
   * Unless no autocomplete handlers were defined (unlikely).
   */
  public async handleAutocomplete(ctx: AutocompleteInteraction) {
    const entry = this.handlers.get(ctx.commandName);
    if (!entry || !entry.autocomplete) return false;

    const { autocomplete } = entry;

    const focusedOption = ctx.options.getFocused(true);
    const optionHandler =
      autocomplete[focusedOption.name as keyof typeof autocomplete];

    if (!optionHandler) return false;

    await optionHandler(ctx, {
      value: focusedOption.value,
      verify: (options: unknown) => options,
    });
  }
}
