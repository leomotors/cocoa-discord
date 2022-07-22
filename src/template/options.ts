import {
    ClientOptions,
    GatewayIntentBits as I,
    Interaction,
    Message,
    Partials as P,
} from "discord.js";

import { Context } from "../main";

/**
 * Basic Template Intents includes
 *
 * GUILDS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS, DIRECT_MESSAGES, DIRECT_MESSAGE_REACTIONS
 *
 * @deprecated use {@link CocoaIntent} instead, also avoid adding unused intents.
 */
export const CocoaIntents: ClientOptions["intents"] = [
    I.Guilds,
    I.GuildMessages,
    I.GuildMessageReactions,
    I.DirectMessages,
    I.DirectMessageReactions,
];

/**
 * Template Intents with Voice, includes
 *
 * CocoaIntents + GUILD_VOICE_STATES
 *
 * @deprecated use {@link CocoaIntent} instead, also avoid adding unused intents.
 */
export const DJCocoaIntents: ClientOptions["intents"] = [
    ...CocoaIntents,
    I.GuildVoiceStates,
];

/**
 * Template ClientOptions used in Cocoa Grader
 *
 * @deprecated use {@link CocoaIntent} instead, also avoid adding unused intents.
 */
export const CocoaOptions: ClientOptions = {
    intents: CocoaIntents,
    // To Accept DM
    partials: [P.Channel],
};

/**
 * Template ClientOptions used in Harunon.js
 *
 * @deprecated use {@link CocoaIntent} instead, also avoid adding unused intents.
 */
export const DJCocoaOptions: ClientOptions = {
    intents: DJCocoaIntents,
    // To Accept DM
    partials: [P.Channel],
};

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

    /**
     * Add `Guilds`
     *
     * This is **required** if you are syncing commands by guild
     */
    useGuildSlash() {
        this.intents.push(I.Guilds);
        return this;
    }

    /**
     * Add `GuildMessages`
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
}

/** Get User who create `Context` (`Message` or `Interaction`) */
export function Author(ctx: Context) {
    const user = (ctx as Interaction).user ?? (ctx as Message).author;

    return {
        name: user.username,
        iconURL: user.avatarURL() ?? user.defaultAvatarURL,
    };
}
