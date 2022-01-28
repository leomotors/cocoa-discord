// * https://stackoverflow.com/a/49910890
export type NonEmptyArray<T> = T[] & { 0: T };

export type Awaitable<T> = T | PromiseLike<T>;

/** commandName **must equal to** it's value .command.name */
export type commandsDict<T> = {
    [commandName: string]: T;
};

export interface Cog<T> {
    name: string;
    description?: string;
    commands: commandsDict<T>;
}
