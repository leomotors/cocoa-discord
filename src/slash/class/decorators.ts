import { APIApplicationCommandOptionChoice } from "discord-api-types/v10";

import { CogSlashClass } from "./legacy";

namespace V2Decorators {
    export interface Args<T = string | number> {
        type?: string;
        description?: string;
        required?: boolean;
        choices?: APIApplicationCommandOptionChoice<T>[];
        autocomplete?: boolean;
    }

    export interface Data {
        name?: string;
        description?: string;
        args?: Record<number, Args>;
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

export function getArgumentStore(cog: CogSlashClass, propertyKey: string) {
    const cogStore = (V2Stores[cog.constructor.name] ??= {});
    const argsStore = ((cogStore[propertyKey] ??= {}).args ??= {});
    return argsStore;
}

export namespace Args {
    function argumentsFactory(type: string) {
        return (description?: string, option?: ArgumentOptions) =>
            argumentsDecorator(type, description, option);
    }

    type ArgumentOptions = { required?: boolean; autocomplete?: boolean };

    export const String = argumentsFactory("string");
    export const User = argumentsFactory("user");

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

    export function argumentsDecorator(
        type: string,
        description: string | undefined,
        option?: ArgumentOptions
    ) {
        const { required = true, autocomplete = false } = option ?? {};

        if (typeof option === "string") {
        }
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
