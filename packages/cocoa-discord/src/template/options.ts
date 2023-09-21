import {
  ClientOptions,
  GatewayIntentBits as I,
  Interaction,
  Message,
  Partials as P,
} from "discord.js";

import { Context } from "../main/index.js";

export interface MessageIntentOptions {
  withReaction?: true;
  withTyping?: true;
}

/**
 * Utility class that help you construct Intents and Partials in *Cocoa* way,
 * these are used to register event listener to Discord
 *
 * It is best practice to request for only what you need,
 * this also improve performance of your bot.
 *
 * For more information, see
 * - {@link https://discord.com/developers/docs/topics/gateway#gateway-intents}
 * - {@link https://discord.com/developers/docs/topics/gateway#commands-and-events-gateway-events}
 */
export class CocoaIntent
  implements Pick<ClientOptions, "intents" | "partials">
{
  intents: number[] = [];
  partials: number[] = [];

  /** Push elements to `intents` */
  addIntents(...items: number[]) {
    this.intents.push(...items);
    return this;
  }

  /** Push elements to `partials` */
  addPartials(...items: number[]) {
    this.partials.push(...items);
    return this;
  }

  /**
   * Add `Guilds`
   *
   * This is **required** if you are syncing commands by guild
   */
  useGuild() {
    this.intents.push(I.Guilds);
    return this;
  }

  /**
   * Add `GuildMessages`
   *
   * `useGuild` is also required for this to work
   *
   * @param withReaction Use this if you want to recieve information about reactions change
   * @param withTyping Use this if you want to recieve information about user is typing
   */
  useGuildMessage(options?: MessageIntentOptions) {
    const { withReaction, withTyping } = options ?? {};

    this.intents.push(I.GuildMessages);

    if (withReaction) this.intents.push(I.GuildMessageReactions);

    if (withTyping) this.intents.push(I.GuildMessageTyping);

    return this;
  }

  /**
   * Add `MessageContent`, **THIS IS PRIVILEGED INTENT**
   *
   * Only use this if your bot wants to read every message,
   * {@link useGuildMessage} alone will work if your bot only react
   * to message mentioning it or from Direct Message.
   *
   * If you use Message Center with prefix, this is required intent.
   */
  useReadMessage() {
    this.intents.push(I.MessageContent);
    return this;
  }

  /**
   * @param withReaction Use this if you want to recieve information about reactions change
   * @param withTyping Use this if you want to recieve information about user is typing
   */
  useDirectMessage(options?: MessageIntentOptions) {
    const { withReaction, withTyping } = options ?? {};

    this.intents.push(I.DirectMessages);
    this.partials.push(P.Channel);

    if (withReaction) this.intents.push(I.DirectMessageReactions);

    if (withTyping) this.intents.push(I.DirectMessageTyping);

    return this;
  }

  /**
   * Add `GUILD_VOICE_STATES`,
   * this is required if you use `@leomotors/music-bot`
   */
  useGuildVoice() {
    this.intents.push(I.GuildVoiceStates);
    return this;
  }
}

/** Get User who create `Context` (`Message` or `Interaction`) */
export function Author(ctx: Context) {
  const user = (ctx as Interaction).user ?? (ctx as Message).author;

  return {
    name: user.username,
    iconURL: user.avatarURL() ?? user.defaultAvatarURL,
  };
}
