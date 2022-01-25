import { Message } from "discord.js";

export type UnemptyArray<T> = T[] & { 0: T };

export interface CocoaMessageCommandOptions {
    name: string;
    aliases?: UnemptyArray<string>;
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
