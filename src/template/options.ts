import {
    ClientOptions,
    CommandInteraction,
    Intents,
    Message,
    User,
} from "discord.js";

const f = Intents.FLAGS;

/**
 * Basic Template Intents includes
 *
 * GUILDS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS, DIRECT_MESSAGES, DIRECT_MESSAGE_REACTIONS
 */
export const CocoaIntents: ClientOptions["intents"] = [
    f.GUILDS,
    f.GUILD_MESSAGES,
    f.GUILD_MESSAGE_REACTIONS,
    f.DIRECT_MESSAGES,
    f.DIRECT_MESSAGE_REACTIONS,
];

/**
 * Template Intents with Voice, includes
 *
 * CocoaIntents + GUILD_VOICE_STATES
 */
export const DJCocoaIntents: ClientOptions["intents"] = [
    ...CocoaIntents,
    f.GUILD_VOICE_STATES,
];

/** Template ClientOptions used in Cocoa Grader*/
export const CocoaOptions: ClientOptions = {
    intents: CocoaIntents,
    // To Accept DM
    partials: ["CHANNEL"],
};

/** Template ClientOptions used in Harunon.js */
export const DJCocoaOptions: ClientOptions = {
    intents: DJCocoaIntents,
    // To Accept DM
    partials: ["CHANNEL"],
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
