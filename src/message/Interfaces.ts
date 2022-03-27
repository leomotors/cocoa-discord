import { Message } from "discord.js";

import { Cog, NonEmptyArray } from "../base";

export interface CocoaMessageCommandOptions {
    name: string;
    aliases?: NonEmptyArray<string>;
    description?: string;
}

/** This interface represent a single message command */
export interface CocoaMessage {
    command: CocoaMessageCommandOptions;
    /**
     * @param message - Message Object (Unmodified)
     * @param args - message.content with no mentions and prefixes (Stripped)
     */
    func: (message: Message, args: string) => Promise<void>;
    guild_ids?: string[];
}

/** To silent decorators TypeScript warning, you don't need to use this */
export type PartialCocoaMessageFunction = (message: Message) => Promise<void>;

export type CogMessage = Cog<CocoaMessage>;
