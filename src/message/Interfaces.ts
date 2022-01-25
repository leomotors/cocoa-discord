import { Message } from "discord.js";
import { NonEmptyArray } from "../shared";

export interface CocoaMessageCommandOptions {
    name: string;
    aliases?: NonEmptyArray<string>;
    description?: string;
}

export interface CocoaMessage {
    command: CocoaMessageCommandOptions;
    func: (message: Message, strippedContent: string) => Promise<void>;
}

export interface CogMessage {
    name: string;
    description?: string;
    commands: {
        [commandName: string]: CocoaMessage;
    };
}
