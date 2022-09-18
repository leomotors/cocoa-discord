import { ChatInputCommandInteraction } from "discord.js";

import { SlashCommandBuilder } from "@discordjs/builders";

import { CocoaSlash } from "..";
import { commandsDict } from "../../base";
import { Ephemeral, getEphemeral } from "../../template";

import { CogSlashClass } from "./cog";

export const muckStorage: { [cogName: string]: commandsDict<CocoaSlash> } = {};
export const muckFuture: {
    [cogName: string]: Array<Promise<void>>;
} = {};

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
export function SlashFull(
    command:
        | CocoaSlash["command"]
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
        | SlashCommandBuilder,
    guild_ids?: string[]
) {
    return (
        cog: CogSlashClass,
        key: string,
        desc: TypedPropertyDescriptor<CocoaSlash["func"]> | undefined
    ) => {
        const muck = (muckStorage[cog.constructor.name] ??= {});

        if (command instanceof SlashCommandBuilder) {
            command = command.toJSON();
        }

        type m = CocoaSlash["command"];

        if (command.name === replaceNameKeyword) (command as m).name = key;

        if (muck[command.name]) {
            throw Error(`Duplicate Command Name: ${command.name}`);
        }

        if (desc!.value) {
            muck[command.name] = {
                command: command as m,
                func: desc!.value,
                guild_ids,
            };
        } else {
            throw Error(`Unexpected Error: ${key}'s value is undefined`);
        }
    };
}

/**
 * Automatically add Ephemeral Options to your command
 *
 * Your method should accept 2 arguments (ctx, ephemeral)
 */
SlashFull.Ephemeral = (
    command:
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
        | SlashCommandBuilder,
    guild_ids?: string[]
) => {
    return (
        cog: CogSlashClass,
        key: string,
        desc: TypedPropertyDescriptor<
            (
                ctx: ChatInputCommandInteraction,
                ephemeral: boolean
            ) => Promise<void>
        >
    ) => {
        const muck = (muckStorage[cog.constructor.name] ??= {});

        command.addBooleanOption(Ephemeral());

        if (command.name === replaceNameKeyword) command.setName(key);

        if (muck[command.name]) {
            throw Error(`Duplicate Command Name: ${command.name}`);
        }

        if (desc.value) {
            muck[command.name] = {
                command: command.toJSON(),
                func: async (ctx: ChatInputCommandInteraction) => {
                    const eph = getEphemeral(ctx) ?? false;
                    // todo check if .bind(this) is required
                    await desc.value!.bind(this)(ctx, eph);
                },
                guild_ids,
            };
        } else {
            throw Error(`Unexpected Error: ${key}'s value is undefined`);
        }
    };
};

SlashFull.Future = (
    resolver: () => Promise<
        | SlashCommandBuilder
        | Omit<SlashCommandBuilder, "addSubcommand" | "addSubcommandGroup">
    >,
    guild_ids?: string[]
) => {
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

                if (command.name === replaceNameKeyword)
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
};
