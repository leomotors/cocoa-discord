import { CocoaEmbed, EmbedStyle } from "cocoa-discord";
import { SlashCommand } from "cocoa-discord/slash/class";

import { AudioResource } from "@discordjs/voice";

import { Playable } from "../core/types.js";

export class CognitiveAdapter implements Playable {
  getAudioResource(): Promise<AudioResource<unknown>> {
    throw new Error("Method not implemented.");
  }

  makeEmbed(
    ctx: SlashCommand.Context,
    style: EmbedStyle,
    requesterId: string,
    title: string,
    extraDescription?: string | undefined,
  ): CocoaEmbed {
    throw new Error("Method not implemented.");
  }

  getTitle(): string {
    throw new Error("Method not implemented.");
  }
}
