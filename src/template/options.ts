import {
    ClientOptions,
    CommandInteraction,
    GatewayIntentBits as I,
    Partials as P,
    Message,
    User,
} from "discord.js";

/**
 * Basic Template Intents includes
 *
 * GUILDS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS, DIRECT_MESSAGES, DIRECT_MESSAGE_REACTIONS
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
 */
export const DJCocoaIntents: ClientOptions["intents"] = [
    ...CocoaIntents,
    I.GuildVoiceStates,
];

/** Template ClientOptions used in Cocoa Grader*/
export const CocoaOptions: ClientOptions = {
    intents: CocoaIntents,
    // To Accept DM
    partials: [P.Channel],
};

/** Template ClientOptions used in Harunon.js */
export const DJCocoaOptions: ClientOptions = {
    intents: DJCocoaIntents,
    // To Accept DM
    partials: [P.Channel],
};

export function Author(ctx: CommandInteraction | Message) {
    // @ts-ignore instanceof does not work at runtime
    const user: User = ctx.user ?? ctx.author;

    return {
        name: user.username,
        iconURL:
            user.avatarURL() ??
            "https://cdn.discordapp.com/embed/avatars/1.png",
    };
}
