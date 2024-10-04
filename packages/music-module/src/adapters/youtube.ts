import ytdl from "@distube/ytdl-core";

import { CocoaEmbed, EmbedStyle } from "cocoa-discord";
import { SlashCommand } from "cocoa-discord/slash/class";

import { AudioResource, createAudioResource } from "@discordjs/voice";

import * as play from "play-dl";

import { Playable } from "../core/types.js";
import { beautifyNumber, parseLength, pickLast } from "../core/utils.js";
import { getState, playNextMusicInQueue } from "../core/voice.js";

/**
 * {@link Playable} that plays YouTube Video
 */
export class YoutubeAdapter implements Playable {
  constructor(readonly video: play.YouTubeVideo) {}

  async getAudioResource(): Promise<AudioResource> {
    const stream = ytdl(this.video.url, { filter: "audioonly" });

    const resource = createAudioResource(stream);
    return resource;
  }

  getTitle(): string {
    return `[${this.video.title} - ${this.video.channel?.name}](${this.video.url})`.replaceAll(
      "*",
      "\\*",
    );
  }

  makeEmbed(
    ctx: SlashCommand.Context,
    style: EmbedStyle,
    requesterId: string,
    title: string,
    extraDescription?: string,
  ): CocoaEmbed {
    const emb = style
      .use(ctx)
      .setTitle(title)
      .setDescription(
        `[${this.video.title}](${this.video.url})\n${
          extraDescription ?? ""
        }`.trim(),
      )
      .setThumbnail(pickLast(this.video.thumbnails)?.url ?? "")
      .addInlineFields(
        {
          name: "🎙️Author",
          value: `[${this.video.channel?.name ?? "Unknown"}](${
            this.video.channel?.url
          })`,
        },
        {
          name: "⌛Duration",
          value:
            this.video.durationInSec === 0
              ? "LIVE"
              : parseLength(this.video.durationInSec),
        },

        {
          name: "👁️Watch",
          value: beautifyNumber(this.video.views),
        },
        {
          name: "🎫Requested By",
          value: `<@${requesterId}>`,
        },
      );

    return emb;
  }
}

/**
 * Add music to queue and play it if not playing
 * @returns Meta Info of the Video or string indicating failure reason
 */
export async function getYoutubeVideo(search: string) {
  const type = play.yt_validate(search);

  if (type === "search") {
    const searchRes = (await play.search(search, { limit: 1 }))[0];

    if (!searchRes) {
      return "No video found";
    }

    return searchRes;
  } else if (type === "video") {
    const video = (await play.video_basic_info(search)).video_details;

    return video;
  } else if (type === "playlist") {
    const playlist = await play.playlist_info(search);
    const all_videos = await playlist.all_videos();

    if (all_videos.length < 1) {
      return "This playlist has no videos!";
    }

    return all_videos;
  } else {
    return "Unknown URL";
  }
}

/**
 * Add music to queue and play it if not playing
 * @returns A Queueable object or string indicating failure reason
 */
export async function addMusicToQueue(
  guildId: string,
  search: string,
  requester: string,
) {
  const videos = await getYoutubeVideo(search);

  if (typeof videos === "string") {
    return videos;
  }

  const state = getState(guildId);

  if (Array.isArray(videos)) {
    const toAdd = videos.map((v) => ({
      data: new YoutubeAdapter(v),
      requestedBy: requester,
    }));

    state.musicQueue.push(...toAdd);

    if (!state.isPlaying) playNextMusicInQueue(guildId);
    return toAdd;
  } else {
    const toAdd = {
      data: new YoutubeAdapter(videos),
      requestedBy: requester,
    };

    state.musicQueue.push(toAdd);
    if (!state.isPlaying) playNextMusicInQueue(guildId);
    return toAdd;
  }
}
