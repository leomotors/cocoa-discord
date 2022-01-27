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

export interface CogSlash {
    name: string;
    description?: string;
    commands: commandsDict;
}

/**
 * @deprecated Use CogSlash instead
 */
export type Cog = CogSlash;
