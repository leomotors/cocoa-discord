import { EmbedBuilder } from "discord.js";
import { APIEmbedField } from "discord-api-types/v10";

// #region CocoaEmbed
/**
 * Extended {@link EmbedBuilder} with {@link addInlineFields}.
 * This allow you to save a line of `inline: true`
 */
export class CocoaEmbed extends EmbedBuilder {
  /** Adds fields to the embed (max 25), automatically set inline to true */
  addInlineFields(...fields: Array<Omit<APIEmbedField, "inline">>) {
    return this.addFields(
      fields.map((field) => {
        return {
          ...field,
          inline: true,
        };
      }),
    );
  }
}
// #endregion CocoaEmbed
