import { CocoaEmbed, EmbedStyle } from "cocoa-discord-utils";
import { SlashCommand } from "cocoa-discord-utils/slash/class";

import { AudioPlayer, AudioResource } from "@discordjs/voice";

/** Has methods compatible to this library */
export interface Playable {
  getAudioResource(): Promise<AudioResource>;
  getTitle(): string;
  makeEmbed(
    ctx: SlashCommand.Context,
    style: EmbedStyle,
    requesterId: string,
    title: string,
    extraDescription?: string,
  ): CocoaEmbed;
}

export interface Queueable {
  /** Data that is {@link Playable} interface */
  data: Playable;
  /** Requester ID */
  requestedBy: string;
}

export type MusicState = {
  musicQueue: Queueable[];
  nowPlaying: Queueable | undefined;
  audioPlayer: AudioPlayer | null;
  isLooping: boolean;
  isPlaying: boolean;
  channelId: string | null;
  playingSince: number;
};
