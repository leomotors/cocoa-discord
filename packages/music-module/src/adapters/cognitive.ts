import { Cocoa, CocoaEmbed, EmbedStyle, LogStatus } from "cocoa-discord";
import { SlashCommand } from "cocoa-discord/slash/class";

import { AudioResource, createAudioResource } from "@discordjs/voice";

import { Readable } from "node:stream";

import * as sdk from "microsoft-cognitiveservices-speech-sdk";

import { Playable } from "../core/types.js";

export class CognitiveAdapter implements Playable {
  readonly #speechConfig: sdk.SpeechConfig;

  constructor(
    SPEECH_KEY: string,
    SPEECH_REGION: string,
    readonly voiceName: string,
    readonly content: string,
    readonly voiceFullName?: string,
  ) {
    const speechConfig = sdk.SpeechConfig.fromSubscription(
      SPEECH_KEY,
      SPEECH_REGION,
    );
    speechConfig.speechSynthesisVoiceName = voiceName;

    this.#speechConfig = speechConfig;
  }

  async getAudioResource(): Promise<AudioResource> {
    const synthesizer = new sdk.SpeechSynthesizer(this.#speechConfig);

    return new Promise<AudioResource>((resolve) =>
      synthesizer.speakTextAsync(this.content, (res) => {
        resolve(createAudioResource(Readable.from(Buffer.from(res.audioData))));
      }),
    );
  }

  makeEmbed(
    ctx: SlashCommand.Context,
    style: EmbedStyle,
    requesterId: string,
    title: string,
    extraDescription?: string | undefined,
  ): CocoaEmbed {
    const emb = style
      .use(ctx)
      .setTitle(title)
      .setDescription(extraDescription ?? null)
      .addInlineFields(
        {
          name: "🎙️Speaker",
          value:
            this.voiceFullName ?? this.#speechConfig.speechSynthesisVoiceName,
        },
        {
          name: "🎫Requested By",
          value: `<@${requesterId}>`,
        },
      )
      .addFields({
        name: "Content",
        value:
          this.content.length > 50
            ? this.content.slice(0, 50) + "..."
            : this.content,
      });

    return emb;
  }

  getTitle(): string {
    return `TTS ${
      this.voiceFullName ?? this.#speechConfig.speechSynthesisVoiceName
    }`;
  }
}

export abstract class CognitiveSearch {
  static #SPEECH_KEY: string;
  static #SPEECH_REGION: string;

  static voiceNames: Array<{ name: string; displayName: string }> = [];
  static voiceNamesPromise: Promise<void>;

  static init(SPEECH_KEY: string, SPEECH_REGION: string) {
    if (CognitiveSearch.#SPEECH_KEY) {
      Cocoa.log("[CognitiveSearch] Already initialized", LogStatus.Warning);
    }

    CognitiveSearch.#SPEECH_KEY = SPEECH_KEY;
    CognitiveSearch.#SPEECH_REGION = SPEECH_REGION;

    CognitiveSearch.voiceNamesPromise = CognitiveSearch.getNames();
  }

  static async searchNames(search: string) {
    await CognitiveSearch.voiceNamesPromise;

    const searchLower = search.toLowerCase();

    return CognitiveSearch.voiceNames.filter((v) =>
      v.displayName.toLowerCase().includes(searchLower),
    );
  }

  private static async getNames() {
    const result = await fetch(
      `https://${
        this.#SPEECH_REGION
      }.tts.speech.microsoft.com/cognitiveservices/voices/list`,
      {
        headers: {
          "Ocp-Apim-Subscription-Key": this.#SPEECH_KEY,
        },
      },
    ).then((r) => r.json());

    CognitiveSearch.voiceNames = (
      result as Array<{ LocalName: string; ShortName: string }>
    ).map((v) => ({
      name: v.ShortName,
      displayName: `${v.ShortName} (${v.LocalName})`,
    }));

    console.log("[CognitiveSearch] Voice Names Loaded");
  }
}
