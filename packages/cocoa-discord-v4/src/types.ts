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
