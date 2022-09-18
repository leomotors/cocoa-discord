import { APIEmbedField } from "discord-api-types/v10";
import { EmbedBuilder } from "discord.js";

// #region CocoaEmbed
/**
 * Like Embed but has method addField, addInlineField and addInlineFields,
 * 2rd and 3rd methods allow you to save a line of `inline: true`
 */
export class CocoaEmbed extends EmbedBuilder {
    /**
     * Add a single field
     *
     * @deprecated use `addFields` instead
     */
    addField(field: APIEmbedField) {
        return this.addFields([field]);
    }

    /**
     * Adds a field to the embed (max 25), automatically set inline to true
     *
     * @deprecated use `AddInlineFields` instead
     */
    addInlineField(field: Omit<APIEmbedField, "inline">) {
        (field as APIEmbedField).inline = true;
        return this.addFields(field);
    }

    /** Adds fields to the embed (max 25), automatically set inline to true */
    addInlineFields(...fields: Array<Omit<APIEmbedField, "inline">>) {
        return this.addFields(
            fields.map((field) => {
                return {
                    ...field,
                    inline: true,
                };
            })
        );
    }
}
// #endregion CocoaEmbed
