import { GlobalCommand } from "../slash/index.js";

// * https://stackoverflow.com/a/49910890
export type NonEmptyArray<T> = T[] & { 0: T };
export type Awaitable<T> = T | PromiseLike<T>;
export type valueOf<T> = T[keyof T];
export type ResolvesTo<T> = T | (() => Awaitable<T>);

export type BaseCommand = {
  command: { name: string; description?: string };
  guild_ids?: string[] | GlobalCommand;
};

/** commandName **must equal to** it's value .command.name */
export type commandsDict<T extends BaseCommand> = {
  [commandName: string]: T;
};

export interface Cog<T extends BaseCommand> {
  name: string;
  description?: string;
  commands: commandsDict<T>;
}
