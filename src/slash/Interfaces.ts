import { ApplicationCommandData, CommandInteraction } from "discord.js";

export interface CocoaSlash {
    func: (interaction: CommandInteraction) => void;
    command: ApplicationCommandData;
}

export interface Cog {
    name: string;
    commands: {
        [key: string]: CocoaSlash;
    };
}
