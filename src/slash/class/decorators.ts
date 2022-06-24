import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";
import { ChatInputCommandInteraction, User as TypeUser } from "discord.js";

import { CogSlashClass } from "./legacy";

namespace V2Decorators {
    export interface Params<T = string | number> {
        type?: string;
        description?: string;
        required?: boolean;
        choices?: APIApplicationCommandOptionChoice<T>[];
        autocomplete?: boolean;
    }

    export interface Data {
        name?: string;
        description?: string;
        params?: Record<number, Params>;
    }
}

export const V2Stores = {} as Record<string, Record<string, V2Decorators.Data>>;

export function SlashCommandV2(description?: string) {
    return (cog: CogSlashClass, key: string, _: unknown) => {
        const cogStore = (V2Stores[cog.constructor.name] ??= {});

        console.log(`SlashCommand has been called for ${key}`);

        cogStore[key] = {
            ...cogStore[key],
            name: key,
            description,
        };
    };
}

export namespace SlashCommandV2 {
    export type Context = ChatInputCommandInteraction;
}

export function getArgumentStore(cog: CogSlashClass, propertyKey: string) {
    const cogStore = (V2Stores[cog.constructor.name] ??= {});
    const paramsStore = ((cogStore[propertyKey] ??= {}).params ??= {});
    return paramsStore;
}

export namespace Param {
    function paramsFactory(type: string) {
        return (description?: string, option?: ParamOptions) =>
            paramsDecorator(type, description, option);
    }

    type ParamOptions = { required?: boolean; autocomplete?: boolean };

    export const String = paramsFactory("string");
    export namespace String {
        export type Type = string;
    }

    export const User = paramsFactory("user");
    export namespace User {
        export type Type = TypeUser;
    }

    export function Choices(
        choices: APIApplicationCommandOptionChoice[] | string[]
    ) {
        return (
            cog: CogSlashClass,
            propertyKey: string,
            parameterIndex: number
        ) => {
            const argsStore = getArgumentStore(cog, propertyKey);
            (argsStore[parameterIndex] ??= {}).choices = (
                typeof choices[0] === "string"
                    ? choices.map((c) => ({ name: c, value: c }))
                    : choices
            ) as APIApplicationCommandOptionChoice[];
        };
    }

    export function paramsDecorator(
        type: string,
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
}
