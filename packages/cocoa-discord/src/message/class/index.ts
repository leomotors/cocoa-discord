import { commandsDict } from "../../base/index.js";
import {
  CocoaMessage,
  CogMessage,
  PartialCocoaMessageFunction,
} from "../types.js";

const muckStorage: { [cogName: string]: commandsDict<CocoaMessage> } = {};

/**
 * This class implements `CogMessage`, by OOP magic, you can use
 * ```js
 * addCog(new [your_extended_classname]())
 * ```
 */
export abstract class CogMessageClass implements CogMessage {
  name: string;
  description?: string;
  commands: commandsDict<CocoaMessage>;

  constructor(name: string, description?: string) {
    this.name = name;
    this.description = description;
    this.commands = muckStorage[this.constructor.name] ?? {};

    for (const [_, cmd] of Object.entries(this.commands)) {
      cmd.func = cmd.func.bind(this);
    }
  }
}

/**
 * Example Usage
 * ```ts
 * @MessageCommand({ name: "ping", description: "pong!" })
 * async ping(ctx: Message, strp: string) {
 *   await ctx.reply("pong!");
 * }
 * ```
 * **Note**: If syntax highlight looks broken, blame your IDE.
 * You may look at harunon.js to see this in action
 */
export function MessageCommand(
  command: Partial<CocoaMessage["command"]> = {},
  guild_ids?: string[],
) {
  return (
    cog: CogMessageClass,
    key: string,
    desc:
      | TypedPropertyDescriptor<CocoaMessage["func"]>
      | TypedPropertyDescriptor<PartialCocoaMessageFunction>,
  ) => {
    const muck = (muckStorage[cog.constructor.name] ??= {});

    command.name ||= key;

    if (muck[command.name]) {
      throw Error(`Duplicate Command Name: ${command.name}`);
    }

    if (desc.value) {
      muck[command.name] = {
        command: command as CocoaMessage["command"],
        func: desc.value,
        guild_ids,
      };
    } else {
      throw Error(`Unexpected Error: ${key}'s value is undefined`);
    }
  };
}
