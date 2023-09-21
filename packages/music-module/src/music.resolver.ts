import { EmbedStyle } from "cocoa-discord-utils";
import {
  CogSlashClass,
  SlashCommand,
  Param,
} from "cocoa-discord-utils/slash/class";

import {
  ActionRowBuilder,
  Awaitable,
  Client,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js";

import chalk from "chalk";
import { search } from "play-dl";

import { generateId, SearchEmbedIdPrefix } from "./constants.js";
import * as Service from "./music.service.js";
import {
  musicStates,
  getState,
  removeFromQueue,
  isPaused,
  skipMusic,
  clearMusicQueue,
  addMusicToQueue,
} from "./voice.js";

export class Music extends CogSlashClass {
  protected selectMenuHandler?: (
    i: StringSelectMenuInteraction,
  ) => Awaitable<void>;

  constructor(
    private client: Client,
    private style: EmbedStyle,
    description?: string,
  ) {
    super("Music", description ?? "Cog for playing musics from YouTube");

    client.on("interactionCreate", async (interaction) => {
      if (interaction.isStringSelectMenu() && this.selectMenuHandler) {
        try {
          await this.selectMenuHandler(interaction);
        } catch (err) {
          console.log(chalk.red(`Error while handling Select Menu: ${err}`));
          await interaction.channel?.send(`${err}`).catch(console.error);
        }
      }
    });
  }

  @SlashCommand("Play a song/video from YouTube")
  async play(
    ctx: SlashCommand.Context,
    @Param.String("Youtube URL or Search Query") song: Param.String.Type,
  ) {
    await ctx.deferReply();

    if (await Service.joinHook(ctx)) return;

    const video = await addMusicToQueue(ctx.guildId!, song, ctx.user.id);

    if (typeof video === "string") {
      await ctx.followUp("Cannot find any video with that name");
      return;
    }

    // TODO Handle playlist case (Playlist embed)
    const embed = video.data.makeEmbed(
      ctx,
      this.style,
      ctx.user.id,
      "Added to Queue",
    );

    await ctx.followUp({ embeds: [embed] });
  }

  @SlashCommand("Pause the song")
  async pause(ctx: SlashCommand.Context) {
    if (musicStates[ctx.guildId!]?.audioPlayer?.pause()) await ctx.reply("⏸️");
    else await ctx.reply("❓");
  }

  @SlashCommand("Resume paused song")
  async resume(ctx: SlashCommand.Context) {
    if (musicStates[ctx.guildId!]?.audioPlayer?.unpause())
      await ctx.reply("▶️");
    else await ctx.reply("❓");
  }

  @SlashCommand("Toggle Loop")
  async loop(ctx: SlashCommand.Context) {
    const state = getState(ctx.guildId!);
    state.isLooping = !state.isLooping;

    await ctx.reply(state.isLooping ? "🔁" : "🔂");
  }

  @SlashCommand("Prints the current song")
  async now(ctx: SlashCommand.Context) {
    const state = getState(ctx.guildId!);

    if (!state.isPlaying || !state.nowPlaying) {
      await ctx.reply("Nothing is playing right now!");
      return;
    }

    const embed = state.nowPlaying.data.makeEmbed(
      ctx,
      this.style,
      ctx.user.id,
      "Now Playing",
    );

    await ctx.reply({ embeds: [embed] });
  }

  @SlashCommand("Remove x-th song from the queue")
  async remove(
    ctx: SlashCommand.Context,
    @Param.Integer("Index of removal") index: Param.Integer.Type,
  ) {
    if (index <= 0) {
      await ctx.reply("❗Invalid Index");
      return;
    }

    const music = removeFromQueue(ctx.guildId!, index);

    if (music) {
      await ctx.reply(`✅ Removed **${music.data.getTitle()}**`);
    } else {
      await ctx.reply("❗There is nothing to remove at that index!");
    }
  }

  @SlashCommand("Search for Song on YouTube")
  async search(
    ctx: SlashCommand.Context,
    @Param.String("What to search for") song: Param.String.Type,
  ) {
    await ctx.deferReply();

    const songs = await search(song, { limit: 10 });

    let text = "";
    const ss = songs.slice(0, 10);

    for (let i = 0; i < ss.length; i++) {
      text += `**${i + 1})** ${ss[i]!.title} [${ss[i]!.durationRaw}]\n`;
    }

    const emb = this.style
      .use(ctx)
      .setTitle(`Search Results for "**${song}**"`)
      .setDescription(text || "NO RESULT");

    if (ss.length < 1) {
      await ctx.followUp({ embeds: [emb] });
      return;
    }

    const thisId = generateId(SearchEmbedIdPrefix);

    const menu = new StringSelectMenuBuilder()
      .setCustomId(thisId)
      .setPlaceholder("Select your Song")
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        ss.map((vid) => ({
          label: Service.trimLabel(vid.title ?? "", `[${vid.durationRaw}]`),
          value: vid.url,
        })),
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents([
      menu,
    ]);

    this.selectMenuHandler = async (interaction) => {
      if (interaction.customId !== thisId) {
        // * Old Interaction
        if (interaction.customId.startsWith(SearchEmbedIdPrefix))
          Service.yeetSelectMenu(interaction);
        return;
      }

      if (await Service.joinHook(ctx)) return;
      const prom = addMusicToQueue(
        ctx.guildId!,
        interaction.values[0]!,
        ctx.user.id,
      );

      let newtext = "";
      for (let i = 0; i < ss.length; i++) {
        if (ss[i]!.url === interaction.values[0]) {
          newtext += `**${i + 1}) ${ss[i]!.title} [${ss[i]!.durationRaw}]**\n`;
        } else {
          newtext += `~~**${i + 1})** ${ss[i]!.title} [${
            ss[i]!.durationRaw
          }]~~\n`;
        }
      }

      this.selectMenuHandler = undefined;

      const video = await prom;
      if (typeof video === "string") {
        await interaction.message.edit({
          embeds: [],
          components: [],
          content: `Unexpected Error Occured: ${video}`,
        });
        return;
      }

      await interaction.message.edit({
        embeds: [
          emb.setDescription(newtext),
          video.data.makeEmbed(ctx, this.style, ctx.user.id, "Added to Queue"),
        ],
        components: [],
      });
    };

    await ctx.followUp({
      embeds: [emb],
      components: [row],
    });
  }

  @SlashCommand("Prints out the current Queue")
  async queue(ctx: SlashCommand.Context) {
    const state = getState(ctx.guildId!);
    const q = state.musicQueue;

    let text = "";

    if (state.isLooping) text += "*Loop is currently enabled*\n";

    if (isPaused(ctx.guildId!))
      text += "*Music is currently manually paused*\n";

    if (state.nowPlaying) {
      if (text) text += "\n";
      text += "**Now Playing**\n" + state.nowPlaying.data.getTitle() + "\n";
    }

    if (q?.length > 0) text += "**Queue**\n";

    for (const [index, m] of Object.entries(q ?? [])) {
      text += `**${+index + 1})** ${m.data.getTitle()}\n`;
    }

    const emb = this.style
      .use(ctx)
      .setTitle("Music Queue")
      .setDescription(text || "**The Queue is Empty!**");

    await ctx.reply({ embeds: [emb] });
  }

  @SlashCommand("Skip the current song")
  async skip(ctx: SlashCommand.Context) {
    skipMusic(ctx.guildId!);

    await ctx.reply("⏩");
  }

  @SlashCommand(
    "Clear all songs in the queue, stop playing and leave the channel",
  )
  async clear(ctx: SlashCommand.Context) {
    clearMusicQueue(ctx.guildId!);

    await ctx.reply("Cleared!");
  }

  @SlashCommand("(Force) moves the bot to your voice channel")
  async rejoin(ctx: SlashCommand.Context) {
    if (await Service.joinHook(ctx, true)) return;

    await ctx.reply("✅ Rejoined");
  }
}
