import { Embed } from "@discordjs/builders";

import { APIEmbedField } from "discord-api-types/v10";

/**
 * Like Embed but has method addInlineField and addInlineFields,
 * these method allow you to save a line of `inline: true`
 */
export class CocoaEmbed extends Embed {
    /** Adds a field to the embed (max 25), automatically set inline to true */
    addInlineField(field: Omit<APIEmbedField, "inline">) {
        (field as APIEmbedField).inline = true;
        return this.addField(field);
    }

    /** Adds fields to the embed (max 25), automatically set inline to true */
    addInlineFields(...fields: Array<Omit<APIEmbedField, "inline">>) {
        fields.map((field) => this.addInlineField(field));
        return this;
    }
}
