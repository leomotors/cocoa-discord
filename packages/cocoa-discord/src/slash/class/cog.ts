import {
  APIApplicationCommandOptionChoice,
  ApplicationCommandOptionType,
  ApplicationCommandType,
  ChatInputCommandInteraction,
  RESTPostAPIChatInputApplicationCommandsJSONBody,
} from "discord.js";

import { Awaitable, commandsDict } from "../../base/index.js";
import { CocoaSlash, CogSlash } from "../types.js";

import { V2Stores } from "./decorators.js";
import { muckFuture, muckStorage } from "./legacy.js";

/**
 * This class implements `CogSlash`, by OOP magic, you can use
 * ```js
 * addCog(new [your_extended_classname]())
 * ```
 */
export abstract class CogSlashClass implements CogSlash {
  name: string;
  description?: string;
  commands: commandsDict<CocoaSlash> = {};
  presync: () => Awaitable<void>;

  constructor(name?: string, description?: string) {
    this.name = name || this.constructor.name;
    this.description = description;

    const promises = this.buildAll();

    this.presync = async () => {
      await promises;
    };
  }

  private async buildAll() {
    await this.buildLegacyFutures();
    await this.buildCommands();
  }

  private async buildLegacyFutures() {
    await Promise.all(muckFuture[this.constructor.name] ?? []);
    this.commands = muckStorage[this.constructor.name] ?? {};
    for (const [_, cmd] of Object.entries(this.commands)) {
      cmd.func = cmd.func.bind(this);
    }
  }

  private async buildCommands() {
    const store = V2Stores[this.constructor.name];

    if (!store) return;

    for (const [cmdName, cmd] of Object.entries(store)) {
      if (cmdName !== cmd.name) {
        throw new Error(
          "Unexpected Error while building Slash Commands V2: Name not match",
        );
      }

      const command: RESTPostAPIChatInputApplicationCommandsJSONBody = {
        name: cmdName,
        description: cmd.description!,
        options: [],
        type: ApplicationCommandType.ChatInput,
      };

      const paramNames = this.getParamsName(cmdName);
      if (paramNames.length - 1 !== Object.keys(cmd.params ?? {}).length) {
        throw new Error(
          `Unexpected Error while building parameters in ${cmdName}: The parameter count given does not match the function`,
        );
      }

      for (let index = 1; index < paramNames.length; index++) {
        const param = cmd.params![index];

        if (!param) {
          throw new Error(
            `Unexpected Error while building parameters: Missing parameter for ${paramNames[index]}`,
          );
        }

        if (!param.type || !param.description) {
          throw new Error(
            `Unexpected Error: Required Arguments are missing, recieved type=${param.type}, description=${param.description}`,
          );
        }

        param.name = paramNames[index];

        const options = {
          type: ApplicationCommandOptionType[param.type] as number,
          name: paramNames[index]!,
          description: param.description!,
          required: param.required!,
          autocomplete: param.autocomplete ?? false,
        };

        if (param.choices) {
          let choices = param.choices;
          if (typeof param.choices === "function") {
            choices = await param.choices();
          }

          if (typeof (choices as string[] | number[])[0] !== "object") {
            choices = (choices as string[] | number[]).map((x) => ({
              name: x + "",
              value: x,
            }));
          }

          // @ts-expect-error bruh
          options.choices = choices as APIApplicationCommandOptionChoice[];
        }

        command.options!.push(options);
      }

      this.commands[cmdName] = {
        command,
        func: this.runCommands.bind(this),
        guild_ids: cmd.guild_ids,
        long_description: cmd.long_description,
      };
    }
  }

  private async runCommands(ctx: ChatInputCommandInteraction) {
    const paramInfo = V2Stores[this.constructor.name]![ctx.commandName]!;

    const params: unknown[] = [ctx];

    for (const param of Object.values(paramInfo.params ?? [])) {
      switch (param.type!) {
        case "Attachment":
          params.push(ctx.options.getAttachment(param.name!, param.required!));
          break;
        case "Boolean":
          params.push(ctx.options.getBoolean(param.name!, param.required!));
          break;
        case "Channel":
          params.push(ctx.options.getChannel(param.name!, param.required!));
          break;
        case "Integer":
          params.push(ctx.options.getInteger(param.name!, param.required!));
          break;
        case "Mentionable":
          params.push(ctx.options.getMentionable(param.name!, param.required!));
          break;
        case "Number":
          params.push(ctx.options.getNumber(param.name!, param.required!));
          break;
        case "Role":
          params.push(ctx.options.getRole(param.name!, param.required!));
          break;
        case "String":
          params.push(ctx.options.getString(param.name!, param.required!));
          break;
        case "User":
          params.push(ctx.options.getUser(param.name!, param.required!));
          break;
        default:
          throw new Error("Unknown Parameter Type");
      }
    }

    // @ts-expect-error magic
    await this[ctx.commandName](...params);
  }

  private getParamsName(name: string) {
    // @ts-expect-error too magic
    const func = this[name].toString() as string;

    const params =
      func
        .split("(")[1]
        ?.split(")")[0]
        ?.split(",")
        .filter((x) => x.length)
        .map((x) => x.trim()) ?? [];

    return params;
  }
}
