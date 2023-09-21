import { Context } from "cocoa-discord-utils";
import { Awaitable } from "cocoa-discord-utils/internal/base";

import { GuildMember, VoiceChannel } from "discord.js";

import {
  AudioPlayerStatus,
  createAudioPlayer,
  entersState,
  getVoiceConnection,
  joinVoiceChannel as libJoinVoiceChannel,
  VoiceConnection,
  VoiceConnectionStatus,
} from "@discordjs/voice";

import { MusicState } from "./types.js";
import { getYoutubeVideo, YoutubeAdapter } from "./youtube.js";

function createDefaultMusicState() {
  return {
    musicQueue: [],
    nowPlaying: undefined,
    audioPlayer: null,
    isLooping: false,
    isPlaying: false,
    channelId: null,
    playingSince: 0,
  } satisfies MusicState;
}

export const musicStates: { [guildId: string]: MusicState } = {};

export function getState(guildId: string) {
  return (musicStates[guildId] ??= createDefaultMusicState());
}

export function forceDestroyConnection(conn: VoiceConnection | undefined) {
  try {
    conn?.destroy();
  } catch (e) {
    // pass
  }
}

export function isPaused(guildId: string) {
  return (
    getState(guildId).audioPlayer?.state?.status === AudioPlayerStatus.Paused
  );
}

export enum JoinFailureReason {
  Success,
  AlreadyConnected,
  NoChannel,
  NotJoinable,
  Other,
}

/**
 * Joins to the channel if not already in one.
 */
export async function joinFromContext(
  ctx: Context,
  force = false,
): Promise<JoinFailureReason> {
  const connection = getVoiceConnection(ctx.guildId!);

  if (connection?.state.status === VoiceConnectionStatus.Ready && !force) {
    return JoinFailureReason.AlreadyConnected;
  }

  const voiceChannel = (ctx.member as GuildMember | undefined)?.voice
    .channel as VoiceChannel | undefined;

  if (!voiceChannel) return JoinFailureReason.NoChannel;

  if (!voiceChannel.joinable) return JoinFailureReason.NotJoinable;

  return (await joinVoiceChannel(voiceChannel))
    ? JoinFailureReason.Success
    : JoinFailureReason.Other;
}

/**
 * Joins voice channel
 * @returns Connection
 */
export async function joinVoiceChannel(
  channel: VoiceChannel,
  onDisconnect?: () => Awaitable<void>,
) {
  const connection = libJoinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
    selfMute: false,
  });

  connection.on(VoiceConnectionStatus.Disconnected, async () => {
    try {
      await Promise.race([
        entersState(connection, VoiceConnectionStatus.Signalling, 5_000),
        entersState(connection, VoiceConnectionStatus.Connecting, 5_000),
      ]);
      // Seems to be reconnecting to a new channel - ignore disconnect
    } catch (error) {
      // Seems to be a real disconnect which SHOULDN'T be recovered from
      forceDestroyConnection(connection);
      await onDisconnect?.();
    }
  });

  try {
    await entersState(connection, VoiceConnectionStatus.Ready, 5_000);
    getState(channel.guildId).channelId = channel.id;
    return connection;
  } catch (err) {
    return undefined;
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
    return toAdd[0]!;
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

/**
 * @param guildId
 * @returns `true` if music finished successfully,
 * `false` early if no connection found or later when error occured
 */
export async function playNextMusicInQueue(guildId: string) {
  const state = getState(guildId);

  if (state.isLooping && state.nowPlaying) {
    state.musicQueue.push(state.nowPlaying);
  }

  if (state.musicQueue.length < 1) {
    state.isPlaying = false;
    forceDestroyConnection(getVoiceConnection(guildId));
    state.channelId = null;
    return;
  }

  const nextQueue = state.musicQueue.shift()!;
  state.nowPlaying = nextQueue;

  const connection = getVoiceConnection(guildId);
  if (!connection) return false;

  const audioPlayer = createAudioPlayer();
  state.audioPlayer = audioPlayer;
  connection.subscribe(audioPlayer);

  const resource = await nextQueue.data.getAudioResource();

  audioPlayer.play(resource);

  state.isPlaying = true;
  state.playingSince = new Date().getTime();

  return await new Promise<boolean>((resolve, reject) => {
    audioPlayer.on(AudioPlayerStatus.Idle, () => {
      playNextMusicInQueue(guildId);
      resolve(true);
    });
    audioPlayer.on("error", (err) => {
      playNextMusicInQueue(guildId);
      reject(err);
    });
  });
}

/**
 * Skip the music by force playing next song
 */
export function skipMusic(guildId: string) {
  const connection = getVoiceConnection(guildId);
  if (!connection) return false;

  playNextMusicInQueue(guildId);
}

/**
 * Clear all music in queue, stops the current audio player
 * and disconnect from voice
 */
export function clearMusicQueue(guildId: string) {
  const state = getState(guildId);

  state.musicQueue = [];
  state.audioPlayer?.stop();
  state.nowPlaying = undefined;
  state.isLooping = false;
  state.isPlaying = false;
  state.channelId = null;

  forceDestroyConnection(getVoiceConnection(guildId));
}

/** @returns Removed Music or undefined if index out of bound */
export function removeFromQueue(guildId: string, index: number) {
  const state = getState(guildId);
  return state.musicQueue.splice(index - 1, 1)?.[0];
}
