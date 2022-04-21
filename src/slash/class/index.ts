import { SlashCommandBuilder } from "@discordjs/builders";

import { CocoaSlash, CogSlash } from "..";
import { Awaitable, commandsDict } from "../../base";

const muckStorage: { [cogName: string]: commandsDict<CocoaSlash> } = {};
const muckFuture: {
    [cogName: string]: Array<Promise<void>>;
} = {};

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

    constructor(name: string, description?: string) {
        this.name = name;
        this.description = description;

        const presyncprom = (async () => {
            await Promise.all(muckFuture[this.constructor.name] ?? []);
            this.commands = muckStorage[this.constructor.name] ?? {};
            for (const [_, cmd] of Object.entries(this.commands)) {
                cmd.func = cmd.func.bind(this);
            }
        })();

        this.presync = async () => {
            await presyncprom;
        };
    }
}

export const replaceNameKeyword = "__replace_with_method_name__";

/**
 * Example Usage
 * ```ts
 * @SlashCommand(new SlashCommandBuilder().setName("ping").setDescription("pong!"))
 * async ping(ctx: CommandInteraction) {
 *   await ctx.reply("pong!");
 * }
 * ```
 * **Note**: If syntax highlight looks broken, blame your IDE.
 * You may look at harunon.js to see this in action
 */
export function SlashCommand(
    command:
        | CocoaSlash["command"]
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
        | SlashCommandBuilder,
    guild_ids?: string[]
) {
    return (
        cog: CogSlashClass,
        key: string,
        desc: TypedPropertyDescriptor<CocoaSlash["func"]>
    ) => {
        const muck = (muckStorage[cog.constructor.name] ??= {});

        if (command instanceof SlashCommandBuilder) {
            command = command.toJSON();
        }

        type m = CocoaSlash["command"];

        if (command.name == replaceNameKeyword) (command as m).name = key;

        if (muck[command.name]) {
            throw Error(`Duplicate Command Name: ${command.name}`);
        }

        if (desc.value) {
            muck[command.name] = {
                command: command as m,
                func: desc.value,
                guild_ids,
            };
        } else {
            throw Error(`Unexpected Error: ${key}'s value is undefined`);
        }
    };
}

export function FutureSlash(
    resolver: () => Promise<
        | SlashCommandBuilder
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    >,
    guild_ids?: string[]
) {
    return (
        cog: CogSlashClass,
        key: string,
        desc: TypedPropertyDescriptor<CocoaSlash["func"]>
    ) => {
        const muckF = (muckFuture[cog.constructor.name] ??= []);
        muckF.push(
            (async () => {
                const command = (await resolver()).toJSON();
                type m = CocoaSlash["command"];

                if (command.name == replaceNameKeyword)
                    (command as m).name = key;

                const muck = (muckStorage[cog.constructor.name] ??= {});
                if (muck[command.name]) {
                    throw Error(`Duplicate Command Name: ${command.name}`);
                }

                if (desc.value) {
                    muck[command.name] = {
                        command,
                        func: desc.value,
                        guild_ids,
                    };
                } else {
                    throw Error(
                        `Unexpected Error: ${key}'s value is undefined`
                    );
                }
            })()
        );
    };
}
