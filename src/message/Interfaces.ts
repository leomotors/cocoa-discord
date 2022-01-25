import { Message } from "discord.js";
import { NonEmptyArray } from "../shared";

export interface CocoaMessageCommandOptions {
    name: string;
    aliases?: NonEmptyArray<string>;
    description?: string;
}

export interface CocoaMessage {
    command: CocoaMessageCommandOptions;
    /**
     * @param message - Message Object (Unmodified)
     * @param strippedContent - message.content with no mentions and prefixes
     */
    func: (message: Message, strippedContent: string) => Promise<void>;
}

export interface CogMessage {
    name: string;
    description?: string;
    commands: {
        [commandName: string]: CocoaMessage;
    };
}
