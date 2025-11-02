import { CommandInteractionOptionResolver } from "discord.js";

export type ChannelOptionType = NonNullable<
  ReturnType<CommandInteractionOptionResolver["getChannel"]>
>;

export type MentionableOptionType = NonNullable<
  ReturnType<CommandInteractionOptionResolver["getMentionable"]>
>;

export type RoleOptionType = NonNullable<
  ReturnType<CommandInteractionOptionResolver["getRole"]>
>;

// * https://stackoverflow.com/a/49910890
export type NonEmptyArray<T> = T[] & { 0: T };
export type Awaitable<T> = T | PromiseLike<T>;
export type valueOf<T> = T[keyof T];
export type ResolvesTo<T> = T | (() => Awaitable<T>);
