import { EmbedStyle } from "cocoa-discord";
import {
  Param,
  SlashCommand,
  SlashModuleClass,
} from "cocoa-discord/slash/class";

import { CognitiveAdapter, CognitiveSearch } from "../adapters/cognitive.js";
import { Queueable } from "../core/types.js";
import { getState, playNextMusicInQueue } from "../core/voice.js";

export class TTS extends SlashModuleClass {
  readonly #speechKey: string;
  readonly #speechRegion: string;

  constructor(
    speechKey: string,
    speechRegion: string,
    private style: EmbedStyle,
    description?: string,
  ) {
    super("TTS", description ?? "Module for text to speech");

    CognitiveSearch.init(speechKey, speechRegion);
    this.#speechKey = speechKey;
    this.#speechRegion = speechRegion;
  }

  @SlashCommand("Speak with Azure TTS!")
  async speak(
    ctx: SlashCommand.Context,
    @Param.String("Text content") content: Param.String.Type,
    @Param.String("Voice name") voice: Param.String.Type,
  ) {
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    await ctx.deferReply();

    const voiceNames = await CognitiveSearch.searchNames(voice);

    if (voiceNames.length === 0) {
      await ctx.followUp("No voice found!");
      return;
    }

    const voiceName = voiceNames[0]!;

    const toQueue = {
      data: new CognitiveAdapter(
        this.#speechKey,
        this.#speechRegion,
        voiceName.name,
        content,
      ),
      requestedBy: ctx.user.id,
    } satisfies Queueable;

    const state = getState(ctx.guildId);
    state.musicQueue.push(toQueue);

    if (!state.isPlaying) {
      playNextMusicInQueue(ctx.guildId);
    }

    const embed = toQueue.data.makeEmbed(
      ctx,
      this.style,
      ctx.user.id,
      "Added to Queue",
    );

    await ctx.followUp({ embeds: [embed] });
  }
}
