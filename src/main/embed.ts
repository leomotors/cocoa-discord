import { EmbedBuilder } from "@discordjs/builders";

import { APIEmbedField } from "discord-api-types/v9";

/**
 * Like Embed but has method addField, addInlineField and addInlineFields,
 * 2rd and 3rd methods allow you to save a line of `inline: true`
 */
export class CocoaEmbed extends EmbedBuilder {
    /** Add a single field */
    addField(field: APIEmbedField) {
        return this.addFields([field]);
    }

    /** Adds a field to the embed (max 25), automatically set inline to true */
    addInlineField(field: Omit<APIEmbedField, "inline">) {
        (field as APIEmbedField).inline = true;
        return this.addFields([field]);
    }

    /** Adds fields to the embed (max 25), automatically set inline to true */
    addInlineFields(...fields: Array<Omit<APIEmbedField, "inline">>) {
        fields.map((field) => this.addInlineField(field));
        return this;
    }
}
