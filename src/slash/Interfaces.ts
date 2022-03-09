import {
    ApplicationCommandDataResolvable,
    CommandInteraction,
} from "discord.js";

import { Cog } from "../base";

/** This interface represent a single slash command */
export interface CocoaSlash {
    command: ApplicationCommandDataResolvable;
    func: (interaction: CommandInteraction) => Promise<void>;
    guild_ids?: string[];
}

export type CogSlash = Cog<CocoaSlash>;
