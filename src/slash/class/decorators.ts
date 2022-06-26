import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";
import Discord, { ChatInputCommandInteraction } from "discord.js";

import { ResolvesTo } from "../../base";

import { CogSlashClass } from "./cog";

export namespace V2Decorators {
    export interface Params {
        type?: keyof Param.Types;
        name?: string;
        description?: string;
        required?: boolean;
        choices?: ResolvesTo<APIApplicationCommandOptionChoice[] | string[]>;
        autocomplete?: boolean;
    }

    export interface Data {
        name?: string;
        description?: string;
        params?: Record<number, Params>;
        guild_ids?: string[];
    }
}

export const V2Stores = {} as Record<string, Record<string, V2Decorators.Data>>;

export function SlashCommand(description: string, guild_ids?: string[]) {
    return (cog: CogSlashClass, key: string, _: unknown) => {
        const cogStore = (V2Stores[cog.constructor.name] ??= {});

        cogStore[key] = {
            ...cogStore[key],
            name: key,
            description,
            guild_ids,
        };
    };
}

export namespace SlashCommand {
    export type Context = ChatInputCommandInteraction;
}

export function getArgumentStore(cog: CogSlashClass, propertyKey: string) {
    const cogStore = (V2Stores[cog.constructor.name] ??= {});
    const paramsStore = ((cogStore[propertyKey] ??= {}).params ??= {});
    return paramsStore;
}

export namespace Param {
    export function paramsFactory(type: keyof Types) {
        return (description: string, option?: ParamOptions) =>
            paramsDecorator(type, description, option);
    }

    type ParamOptions = { required?: boolean; autocomplete?: boolean };

    export const Ephemeral = paramsDecorator(
        "boolean",
        "Make the response ephemeral and only visible to you",
        { required: false }
    );
    export namespace Ephemeral {
        export type Type = boolean;
    }

    export function Choices(
        choices: ResolvesTo<APIApplicationCommandOptionChoice[] | string[]>
    ) {
        return (
            cog: CogSlashClass,
            propertyKey: string,
            parameterIndex: number
        ) => {
            const argsStore = getArgumentStore(cog, propertyKey);
            (argsStore[parameterIndex] ??= {}).choices = choices;
        };
    }

    export function paramsDecorator(
        type: keyof Types,
        description: string | undefined,
        option?: ParamOptions
    ) {
        const { required = true, autocomplete = false } = option ?? {};

        return (
            cog: CogSlashClass,
            propertyKey: string,
            parameterIndex: number
        ) => {
            if (parameterIndex < 1) {
                throw Error("First argument must be ctx!");
            }

            const argsStore = getArgumentStore(cog, propertyKey);

            argsStore[parameterIndex] = {
                ...argsStore[parameterIndex],
                type,
                description,
                required,
                autocomplete,
            };
        };
    }

    export type Types = {
        attachment: Discord.Attachment;
        boolean: boolean;
        channel:
            | Discord.APIInteractionDataResolvedChannel
            | Discord.GuildBasedChannel;
        integer: number;
        mentionable:
            | Discord.GuildMember
            | Discord.APIInteractionDataResolvedGuildMember
            | Discord.Role
            | Discord.APIRole
            | Discord.User;
        number: number;
        role: Discord.Role | Discord.APIRole;
        string: string;
        user: Discord.User;
    };

    export const Attachment = paramsFactory("attachment");
    export namespace Attachment {
        export type Type = Types["attachment"];
    }

    export const Boolean = paramsFactory("boolean");
    export namespace Boolean {
        export type Type = Types["boolean"];
    }

    export const Channel = paramsFactory("channel");
    export namespace Channel {
        export type Type = Types["channel"];
    }

    export const Integer = paramsFactory("integer");
    export namespace Integer {
        export type Type = Types["integer"];
    }

    export const Mentionable = paramsFactory("mentionable");
    export namespace Mentionable {
        export type Type = Types["mentionable"];
    }

    export const Number = paramsFactory("number");
    export namespace Number {
        export type Type = Types["number"];
    }

    export const Role = paramsFactory("role");
    export namespace Role {
        export type Type = Types["role"];
    }

    export const String = paramsFactory("string");
    export namespace String {
        export type Type = string;
    }

    export const User = paramsFactory("user");
    export namespace User {
        export type Type = Types["user"];
    }
}
