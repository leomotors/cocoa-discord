import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";
import { ChatInputCommandInteraction } from "discord.js";

import { ResolvesTo } from "../../base";

import { CogSlashClass } from "./cog";

export namespace V2Decorators {
    export interface Params {
        type?: keyof Param.Types;
        name?: string;
        description?: string;
        required?: boolean;
        choices?: ResolvesTo<
            APIApplicationCommandOptionChoice[] | string[] | number[]
        >;
        autocomplete?: boolean;
    }

    export interface Data {
        name?: string;
        description?: string;
        long_description?: string;
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

export function Help(long_description: string) {
    return (cog: CogSlashClass, key: string, _: unknown) => {
        const cogStore = (V2Stores[cog.constructor.name] ??= {});

        cogStore[key] = {
            ...cogStore[key],
            long_description,
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

    export type ParamOptions = { required?: boolean; autocomplete?: boolean };

    /** Add a Boolean Option with template description for ephmeral option */
    export const Ephemeral = paramsDecorator(
        "Boolean",
        "Make the response ephemeral and only visible to you",
        { required: false }
    );
    export namespace Ephemeral {
        export type Type = Types["Boolean"] | null;
    }

    export type ACO<T> = ResolvesTo<
        APIApplicationCommandOptionChoice<T>[] | T[]
    >;

    export function Choices<T>(
        choices: T extends string
            ? ACO<string>
            : T extends number
            ? ACO<number>
            : never
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

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    export type NR<T extends (...args: any[]) => any> = NonNullable<
        ReturnType<T>
    >;
    export type CIO = ChatInputCommandInteraction["options"];

    export type Types = {
        Attachment: NR<CIO["getAttachment"]>;
        Boolean: NR<CIO["getBoolean"]>;
        Channel: NR<CIO["getChannel"]>;
        Integer: NR<CIO["getInteger"]>;
        Mentionable: NR<CIO["getMentionable"]>;
        Number: NR<CIO["getNumber"]>;
        Role: NR<CIO["getRole"]>;
        String: NR<CIO["getString"]>;
        User: NR<CIO["getUser"]>;
    };

    export const Attachment = paramsFactory("Attachment");
    export namespace Attachment {
        export type Type = Types["Attachment"];
        export type Nullable = Type | null;
    }

    export const Boolean = paramsFactory("Boolean");
    export namespace Boolean {
        export type Type = Types["Boolean"];
        export type Nullable = Type | null;
    }

    export const Channel = paramsFactory("Channel");
    export namespace Channel {
        export type Type = Types["Channel"];
        export type Nullable = Type | null;
    }

    export const Integer = paramsFactory("Integer");
    export namespace Integer {
        export type Type = Types["Integer"];
        export type Nullable = Type | null;
    }

    export const Mentionable = paramsFactory("Mentionable");
    export namespace Mentionable {
        export type Type = Types["Mentionable"];
        export type Nullable = Type | null;
    }

    export const Number = paramsFactory("Number");
    export namespace Number {
        export type Type = Types["Number"];
        export type Nullable = Type | null;
    }

    export const Role = paramsFactory("Role");
    export namespace Role {
        export type Type = Types["Role"];
        export type Nullable = Type | null;
    }

    export const String = paramsFactory("String");
    export namespace String {
        export type Type = Types["String"];
        export type Nullable = Type | null;
    }

    export const User = paramsFactory("User");
    export namespace User {
        export type Type = Types["User"];
        export type Nullable = Type | null;
    }
}
