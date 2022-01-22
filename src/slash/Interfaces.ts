import {
    ApplicationCommandDataResolvable,
    CommandInteraction,
} from "discord.js";

export interface CocoaSlash {
    command: ApplicationCommandDataResolvable;
    func: (interaction: CommandInteraction) => Promise<void>;
}

export interface Cog {
    name: string;
    commands: {
        [key: string]: CocoaSlash;
    };
}
