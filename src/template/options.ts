import { ClientOptions, CommandInteraction, Intents } from "discord.js";

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
    partials: ["MESSAGE"],
};

/** Template ClientOptions used in Harunon.js */
export const DJCocoaOptions: ClientOptions = {
    intents: DJCocoaIntents,
    // To Accept DM
    partials: ["MESSAGE"],
};

export function Author(ctx: CommandInteraction) {
    return {
        name: ctx.user.username,
        iconURL: ctx.user.avatarURL() ?? "",
    };
}
