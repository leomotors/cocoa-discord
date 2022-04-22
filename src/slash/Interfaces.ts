import {
    ApplicationCommandDataResolvable,
    ChatInputCommandInteraction,
} from "discord.js";

import { Awaitable, Cog } from "../base";

/** This interface represent a single slash command */
export interface CocoaSlash {
    command: ApplicationCommandDataResolvable;
    func: (interaction: ChatInputCommandInteraction) => Promise<void>;
    guild_ids?: string[];
}

export interface CogSlash extends Cog<CocoaSlash> {
    /** This hook should only be handled internally */
    presync?: () => Awaitable<void>;
}
