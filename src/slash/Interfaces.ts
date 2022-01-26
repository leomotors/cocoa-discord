import {
    ApplicationCommandDataResolvable,
    CommandInteraction,
} from "discord.js";

export interface CocoaSlash {
    command: ApplicationCommandDataResolvable;
    func: (interaction: CommandInteraction) => Promise<void>;
}

export type commandsDict = {
    [commandName: string]: CocoaSlash;
};

export interface Cog {
    name: string;
    description?: string;
    commands: commandsDict;
}

export type CogSlash = Cog;
