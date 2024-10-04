import { EmbedStyle } from "cocoa-discord";
import {
  Param,
  SlashCommand,
  SlashModuleClass,
} from "cocoa-discord/slash/class";

import {
  ActionRowBuilder,
  Awaitable,
  Client,
  StringSelectMenuBuilder,
  StringSelectMenuInteraction,
} from "discord.js";

import chalk from "chalk";
import { search } from "play-dl";

import { addMusicToQueue } from "../adapters/youtube.js";
import { SearchEmbedIdPrefix, generateId } from "../core/constants.js";
import { pickFirst } from "../core/utils.js";
import {
  clearMusicQueue,
  getState,
  isPaused,
  musicStates,
  removeFromQueue,
  skipMusic,
} from "../core/voice.js";

import * as Service from "./music.service.js";

export class Music extends SlashModuleClass {
  protected selectMenuHandler?: (
    i: StringSelectMenuInteraction,
  ) => Awaitable<void>;

  constructor(
    private client: Client,
    private getStyle: () => EmbedStyle,
    description?: string,
  ) {
    super("Music", description ?? "Module for playing musics from YouTube");

    client.on("interactionCreate", async (interaction) => {
      if (interaction.isStringSelectMenu() && this.selectMenuHandler) {
        try {
          await this.selectMenuHandler(interaction);
        } catch (err) {
          console.log(chalk.red(`Error while handling Select Menu: ${err}`));

          if (interaction.channel?.isSendable()) {
            await interaction.channel.send(`${err}`).catch(console.error);
          } else {
            console.log(
              chalk.red(`Channel ${interaction.channelId} is not sendable`),
            );
          }
        }
      }
    });
  }

  @SlashCommand("Play a song/video from YouTube")
  async play(
    ctx: SlashCommand.Context,
    @Param.String("Youtube URL or Search Query") song: Param.String.Type,
  ) {
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    await ctx.deferReply();

    if (await Service.joinHook(ctx)) return;

    const video = await addMusicToQueue(ctx.guildId, song, ctx.user.id);

    if (typeof video === "string") {
      await ctx.followUp("Cannot find any video with that name");
      return;
    }

    const videoForEmbed = pickFirst(video)!;

    const embed = videoForEmbed.data.makeEmbed(
      ctx,
      this.getStyle(),
      ctx.user.id,
      "Added to Queue",
    );

    if (Array.isArray(video) && video.length > 1) {
      embed.setTitle("Added Playlist to Queue");

      const otherTitles = [video[1]?.data.getTitle(), video[2]?.data.getTitle()]
        .filter(Boolean)
        .join("\n");
      const moreText =
        video.length > 3 ? `\n... and ${video.length - 3} more` : "";

      embed.setDescription(
        embed.data.description + `\n${otherTitles}${moreText}`,
      );
    }

    await ctx.followUp({ embeds: [embed] });
  }

  @SlashCommand("Pause the song")
  async pause(ctx: SlashCommand.Context) {
    if (musicStates[ctx.guildId ?? "void"]?.audioPlayer?.pause())
      await ctx.reply("⏸️");
    else await ctx.reply("");
  }

  @SlashCommand("Resume paused song")
  async resume(ctx: SlashCommand.Context) {
    if (musicStates[ctx.guildId ?? "void"]?.audioPlayer?.unpause())
      await ctx.reply("▶️");
    else await ctx.reply("❓");
  }

  @SlashCommand("Toggle Loop")
  async loop(ctx: SlashCommand.Context) {
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    const state = getState(ctx.guildId);
    state.isLooping = !state.isLooping;

    await ctx.reply(state.isLooping ? "🔁" : "🔂");
  }

  @SlashCommand("Prints the current song")
  async now(ctx: SlashCommand.Context) {
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    const state = getState(ctx.guildId);

    if (!state.isPlaying || !state.nowPlaying) {
      await ctx.reply("Nothing is playing right now!");
      return;
    }

    const embed = state.nowPlaying.data.makeEmbed(
      ctx,
      this.getStyle(),
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
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    if (index <= 0) {
      await ctx.reply("❗Invalid Index");
      return;
    }

    const music = removeFromQueue(ctx.guildId, index);

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
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    const guildId = ctx.guildId;

    await ctx.deferReply();

    const songs = await search(song, { limit: 10 });

    let text = "";
    const ss = songs.slice(0, 10);

    for (let i = 0; i < ss.length; i++) {
      text += `**${i + 1})** ${ss[i]!.title} [${ss[i]!.durationRaw}]\n`;
    }

    const emb = this.getStyle()
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
        guildId,
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
          pickFirst(video)!.data.makeEmbed(
            ctx,
            this.getStyle(),
            ctx.user.id,
            "Added to Queue",
          ),
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
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    const state = getState(ctx.guildId);
    const q = state.musicQueue;

    let text = "";

    if (state.isLooping) text += "*Loop is currently enabled*\n";

    if (isPaused(ctx.guildId)) text += "*Music is currently manually paused*\n";

    if (state.nowPlaying) {
      if (text) text += "\n";
      text += "**Now Playing**\n" + state.nowPlaying.data.getTitle() + "\n";
    }

    if (q?.length > 0) text += "**Queue**\n";

    for (const [index, m] of Object.entries(q ?? [])) {
      if (+index >= 20) break;

      text += `**${+index + 1})** ${m.data.getTitle()}\n`;
    }

    if (q?.length > 20) text += `... and ${q.length - 20} more`;

    const emb = this.getStyle()
      .use(ctx)
      .setTitle("Music Queue")
      .setDescription(text || "**The Queue is Empty!**");

    await ctx.reply({ embeds: [emb] });
  }

  @SlashCommand("Move the song at index to front of the queue")
  async jumpqueue(
    ctx: SlashCommand.Context,
    @Param.Integer("Index of the song") index: Param.Integer.Type,
  ) {
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    const state = getState(ctx.guildId);
    const queue = state.musicQueue;

    if (!queue[index - 1]) {
      await ctx.reply("❗️ No music at that index!");
      return;
    }

    const music = queue.splice(index - 1, 1)[0]!;
    queue.unshift(music);

    await ctx.reply(
      `✅ Moved **${music.data.getTitle()}** to front of the queue`,
    );
  }

  @SlashCommand("Get the song data at given index")
  async musicinfo(
    ctx: SlashCommand.Context,
    @Param.Integer("Index of the song") index: Param.Integer.Type,
  ) {
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    const state = getState(ctx.guildId);
    const queue = state.musicQueue;

    if (!queue[index - 1]) {
      await ctx.reply("❗️ No music at that index!");
      return;
    }

    const music = queue[index - 1]!;

    const emb = music.data.makeEmbed(
      ctx,
      this.getStyle(),
      ctx.user.id,
      `Music at Index ${index}`,
    );

    emb.setTitle(`Music at Index ${index}`);

    await ctx.reply({ embeds: [emb] });
  }

  @SlashCommand("Skip the current song")
  async skip(ctx: SlashCommand.Context) {
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    skipMusic(ctx.guildId);

    await ctx.reply("⏩");
  }

  @SlashCommand(
    "Clear all songs in the queue, stop playing and leave the channel",
  )
  async clear(ctx: SlashCommand.Context) {
    if (!ctx.guildId) {
      await ctx.reply("This command is only available in server!");
      return;
    }

    clearMusicQueue(ctx.guildId);

    await ctx.reply("Cleared!");
  }

  @SlashCommand("(Force) moves the bot to your voice channel")
  async rejoin(ctx: SlashCommand.Context) {
    if (await Service.joinHook(ctx, true)) return;

    await ctx.reply("✅ Rejoined");
  }
}
