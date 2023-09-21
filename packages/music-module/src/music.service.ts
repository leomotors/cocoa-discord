import { SlashCommand } from "cocoa-discord-utils/slash/class";

import { StringSelectMenuInteraction } from "discord.js";

import chalk from "chalk";

import { JoinFailureReason, joinFromContext } from "./voice.js";

/**
 * Try to remove components from that select menu and add a message,
 * catch error and prints if failed
 */
export async function yeetSelectMenu(interaction: StringSelectMenuInteraction) {
  await interaction
    .update({
      content: "This interaction is no longer tracked! Please create new one!",
      components: [],
    })
    .catch(() =>
      console.log(
        chalk.red(
          `Attempt to delete components failed: ${interaction.customId}`,
        ),
      ),
    );
}

/**
 * @returns `true` if should ends the function,
 * it will followUp the interaction printing error message
 */
export async function joinHook(ctx: SlashCommand.Context, force = false) {
  const res = await joinFromContext(ctx, force);

  if (res === JoinFailureReason.NoChannel) {
    await ctx.followUp("Command Failed: No channel to join");
  } else if (res === JoinFailureReason.NotJoinable) {
    await ctx.followUp("Command Failed: This channel is not joinable");
  } else if (res === JoinFailureReason.Other) {
    await ctx.followUp("Command Failed: Unknown Reason");
  } else {
    return false;
  }

  return true;
}

export function trimLabel(p1: string, p2: string) {
  const lenlim = 96 - p2.length;
  if (p1.length > 96 - p2.length) {
    p1 = p1.slice(0, lenlim - 3) + "...";
  }

  return `${p1} ${p2}`;
}
