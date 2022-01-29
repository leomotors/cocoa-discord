import { Intents } from "discord.js";

const f = Intents.FLAGS;

/**
 * Basic Template Intents includes
 *
 * GUILDS, GUILD_MESSAGES, GUILD_MESSAGE_REACTIONS, DIRECT_MESSAGES, DIRECT_MESSAGE_REACTIONS
 */
export const CocoaIntents = {
    intents: [
        f.GUILDS,
        f.GUILD_MESSAGES,
        f.GUILD_MESSAGE_REACTIONS,
        f.DIRECT_MESSAGES,
        f.DIRECT_MESSAGE_REACTIONS,
    ],
    // To Accept DM Message
    partials: ["CHANNEL"],
};

/**
 * Template Intents with Voice, includes
 *
 * CocoaIntents + GUILD_VOICE_STATES
 */
export const DJCocoaIntents = {
    ...CocoaIntents,
    intents: [...CocoaIntents.intents, f.GUILD_VOICE_STATES],
};
