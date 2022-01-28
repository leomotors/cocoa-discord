import {
    ApplicationCommandDataResolvable,
    CommandInteraction,
} from "discord.js";

import { commandsDict } from "../shared";

/** This interface represent a single slash command */
export interface CocoaSlash {
    command: ApplicationCommandDataResolvable;
    func: (interaction: CommandInteraction) => Promise<void>;
}

export interface CogSlash {
    name: string;
    description?: string;
    commands: commandsDict<CocoaSlash>;
}
