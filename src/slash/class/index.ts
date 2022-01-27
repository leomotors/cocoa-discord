import chalk from "chalk";

import { CocoaSlash, commandsDict, CogSlash } from "..";

const muckStorage: { [cogName: string]: commandsDict } = {};

/**
 * **Warning**: This feature is made possible with the existence of **Dark Magic**
 *
 * Or in normal people's word, This is experimental
 */
export abstract class CogClass implements CogSlash {
    name: string;
    description?: string;
    commands: commandsDict;

    constructor(name: string, description?: string) {
        console.log(
            chalk.yellow("[CogClass WARN] This feature is experimental")
        );
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
 * ```js
 * @SlashCommand(new SlashCommandBuilder().setName("ping").setDescription("pong!").toJSON())
 * async ping(ctx: CommandInteraction) {
 *   await ctx.reply("pong!");
 * }
 * ```
 * **Note**: If syntax look broken, blame your IDE.
 * You may look at harunon.js to see this in action
 */
export function SlashCommand(command: CocoaSlash["command"]) {
    return (
        cog: CogClass,
        key: string,
        desc: TypedPropertyDescriptor<CocoaSlash["func"]>
    ) => {
        const muck = (muckStorage[cog.constructor.name] ??= {});

        if (muck[command.name]) {
            throw Error(`Duplicate Command Name: ${command.name}`);
        }

        if (desc.value) {
            muck[command.name] = { command, func: desc.value };
        } else {
            throw Error(`Unexpected Error: ${key}'s value is undefined`);
        }
    };
}
