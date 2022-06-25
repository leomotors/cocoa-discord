import {
    ChatInputCommandInteraction,
    EmbedBuilder,
    EmbedFooterData,
    Message,
} from "discord.js";

import { valueOf } from "../base";
import { Author } from "../template";

import { CocoaEmbed } from "./embed";

/** Message | CommandInteraction */
export type Context = Message | ChatInputCommandInteraction;

export interface EmbedStyleBase {
    author?: "invoker" | "bot";
    color?: number;
    footer?: EmbedFooterData;
}

export type EmbedStyleOptions = {
    [prop in keyof EmbedStyleBase]:
        | EmbedStyleBase[prop]
        | ((ctx: Context) => EmbedStyleBase[prop]);
};

/**
 * Usage:
 * ```js
 * export const style = new EmbedStyle({ ... });
 * ```
 *
 * Embed Styles Properties:
 * - author: "invoker" will set the author to who invoke the commands
 * "bot" is bot, obviously.
 * - color: Color of Embed
 * - footer: Footer of Embed
 *
 * Embed Styles Methods (See each's method JSDoc for more info):
 * - use
 * - apply
 *
 * You can also pass the function that recieves Command Context and return the option.
 * */
export class EmbedStyle {
    private style: EmbedStyleOptions;

    constructor(style: EmbedStyleOptions) {
        this.style = style;
    }

    private setStyle(ctx: Context, embed: EmbedBuilder) {
        const author = this.resolve(ctx, this.style.author);
        const color = this.resolve(ctx, this.style.color);
        const footer = this.resolve(ctx, this.style.footer);

        if (author == "invoker") embed = embed.setAuthor(Author(ctx));
        else if (author == "bot")
            embed = embed.setAuthor({
                name: ctx.client.user!.username,
                iconURL: ctx.client.user!.avatarURL() ?? "",
            });

        if (color) embed = embed.setColor(color);
        if (footer) embed = embed.setFooter(footer);

        return embed;
    }

    /**
     * Create Template Embed based on styles
     *
     * Example Usage:
     * ```js
     * import { style } from "./where/you/export/yourStyle"
     * const emb = style.use(ctx).setTitle(...)
     * ```
     *
     * @returns CocoaEmbed, Derived Class of Embed
     */
    use(ctx: Context) {
        return this.setStyle(ctx, new CocoaEmbed()) as CocoaEmbed;
    }

    /**
     * Apply styles on existing Embed
     *
     * Example Usage:
     * ```js
     * const embed = style.apply(ctx, generateHelpCommandAsEmbed())
     * ```
     */
    apply(ctx: Context, embed: EmbedBuilder) {
        return this.setStyle(ctx, embed);
    }

    private resolve<T extends valueOf<EmbedStyleBase>>(
        ctx: Context,
        res?: T | ((ctx: Context) => T)
    ): T | undefined {
        if (typeof res == "function") {
            return res(ctx);
        }
        return res;
    }

    /**
     * Extends (or Override) this style
     *
     * @returns new extended `EmbedStyle`
     */
    extends(style: Partial<EmbedStyleOptions>) {
        return new EmbedStyle({
            ...this.style,
            ...style,
        });
    }
}

/**
 * Alternative to `new EmbedStyle(opts)` to create Embed Style directly
 *
 * ~~Just like discordjs create stuff~~
 *
 * See {@link EmbedStyle}
 */
export function createEmbedStyle(style: EmbedStyleOptions) {
    return new EmbedStyle(style);
}
