import {
  ApplicationCommandOptionBase,
  Attachment,
  SlashCommandAttachmentOption,
  SlashCommandBooleanOption,
  SlashCommandBuilder,
  SlashCommandChannelOption,
  SlashCommandIntegerOption,
  SlashCommandMentionableOption,
  SlashCommandNumberOption,
  SlashCommandRoleOption,
  SlashCommandStringOption,
  SlashCommandUserOption,
  User,
} from "discord.js";

import {
  ChannelOptionType,
  MentionableOptionType,
  RoleOptionType,
} from "./types.js";

export type AddOptionParams<
  _Name extends string,
  _Required extends boolean,
  _Builder extends ApplicationCommandOptionBase,
> = {
  name: _Name;
  description: string;
  required?: _Required;
  builder?: (option: _Builder) => _Builder;
};

export class TypedSlashBuilder<
  T extends Record<string, unknown> = Record<never, never>,
> {
  readonly builder: SlashCommandBuilder = new SlashCommandBuilder();

  // #region Delegates

  /**
   * Delegates to {@link SlashCommandBuilder#setName}
   */
  setName(name: string): TypedSlashBuilder<T> {
    this.builder.setName(name);
    return this;
  }

  /**
   * Delegates to {@link SlashCommandBuilder#setDescription}
   */
  setDescription(description: string): TypedSlashBuilder<T> {
    this.builder.setDescription(description);
    return this;
  }

  // #endregion Delegates

  // #region Typed Options

  private optionBuilder<T extends ApplicationCommandOptionBase>(
    name: string,
    description: string,
    required: boolean,
    baseBuilder?: (opt: T) => T,
  ) {
    return (option: T) => {
      if (baseBuilder) {
        option = baseBuilder(option);
      }
      option.setName(name).setDescription(description).setRequired(required);
      return option;
    };
  }

  /**
   * Add an attachment option with typed, uses {@link SlashCommandBuilder#addAttachmentOption}
   */
  addAttachmentOption<const N extends string, Req extends boolean = true>({
    name,
    description = "",
    required = true as Req,
    builder,
  }: AddOptionParams<N, Req, SlashCommandAttachmentOption>): TypedSlashBuilder<
    T & Record<N, Req extends true ? Attachment : Attachment | null>
  > {
    this.builder.addAttachmentOption(
      this.optionBuilder(name, description, required, builder),
    );
    return this;
  }

  /**
   * Add a boolean option with typed, uses {@link SlashCommandBuilder#addBooleanOption}
   */
  addBooleanOption<const N extends string, Req extends boolean = true>({
    name,
    description = "",
    required = true as Req,
    builder,
  }: AddOptionParams<N, Req, SlashCommandBooleanOption>): TypedSlashBuilder<
    T & Record<N, Req extends true ? boolean : boolean | null>
  > {
    this.builder.addBooleanOption(
      this.optionBuilder(name, description, required, builder),
    );
    return this;
  }

  /**
   * Add a channel option with typed, uses {@link SlashCommandBuilder#addChannelOption}
   */
  addChannelOption<const N extends string, Req extends boolean = true>({
    name,
    description = "",
    required = true as Req,
    builder,
  }: AddOptionParams<N, Req, SlashCommandChannelOption>): TypedSlashBuilder<
    T &
      Record<N, Req extends true ? ChannelOptionType : ChannelOptionType | null>
  > {
    this.builder.addChannelOption(
      this.optionBuilder(name, description, required, builder),
    );
    return this;
  }

  /**
   * Add an integer option with typed, uses {@link SlashCommandBuilder#addIntegerOption}
   */
  addIntegerOption<const N extends string, Req extends boolean = true>({
    name,
    description = "",
    required = true as Req,
    builder,
  }: AddOptionParams<N, Req, SlashCommandIntegerOption>): TypedSlashBuilder<
    T & Record<N, Req extends true ? number : number | null>
  > {
    this.builder.addIntegerOption(
      this.optionBuilder(name, description, required, builder),
    );
    return this;
  }

  /**
   * Add a mentionable option with typed, uses {@link SlashCommandBuilder#addMentionableOption}
   */
  addMentionableOption<const N extends string, Req extends boolean = true>({
    name,
    description = "",
    required = true as Req,
    builder,
  }: AddOptionParams<N, Req, SlashCommandMentionableOption>): TypedSlashBuilder<
    T &
      Record<
        N,
        Req extends true ? MentionableOptionType : MentionableOptionType | null
      >
  > {
    this.builder.addMentionableOption(
      this.optionBuilder(name, description, required, builder),
    );
    return this;
  }

  /**
   * Add a number option with typed, uses {@link SlashCommandBuilder#addNumberOption}
   */
  addNumberOption<const N extends string, Req extends boolean = true>({
    name,
    description = "",
    required = true as Req,
    builder,
  }: AddOptionParams<N, Req, SlashCommandNumberOption>): TypedSlashBuilder<
    T & Record<N, Req extends true ? number : number | null>
  > {
    this.builder.addNumberOption(
      this.optionBuilder(name, description, required, builder),
    );
    return this;
  }

  /**
   * Add a role option with typed, uses {@link SlashCommandBuilder#addRoleOption}
   */
  addRoleOption<const N extends string, Req extends boolean = true>({
    name,
    description = "",
    required = true as Req,
    builder,
  }: AddOptionParams<N, Req, SlashCommandRoleOption>): TypedSlashBuilder<
    T & Record<N, Req extends true ? RoleOptionType : RoleOptionType | null>
  > {
    this.builder.addRoleOption(
      this.optionBuilder(name, description, required, builder),
    );
    return this;
  }

  /**
   * Add a string option with typed, uses {@link SlashCommandBuilder#addStringOption}
   */
  addStringOption<const N extends string, Req extends boolean = true>({
    name,
    description = "",
    required = true as Req,
    builder,
  }: AddOptionParams<N, Req, SlashCommandStringOption>): TypedSlashBuilder<
    T & Record<N, Req extends true ? string : string | null>
  > {
    this.builder.addStringOption(
      this.optionBuilder(name, description, required, builder),
    );
    return this;
  }

  /**
   * Add a user option with typed, uses {@link SlashCommandBuilder#addUserOption}
   */
  addUserOption<const N extends string, Req extends boolean = true>({
    name,
    description = "",
    required = true as Req,
    builder,
  }: AddOptionParams<N, Req, SlashCommandUserOption>): TypedSlashBuilder<
    T & Record<N, Req extends true ? User : User | null>
  > {
    this.builder.addUserOption(
      this.optionBuilder(name, description, required, builder),
    );
    return this;
  }

  // #endregion Typed Options
}
