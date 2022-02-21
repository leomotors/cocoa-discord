import { Embed } from "@discordjs/builders";

import { CommandInteraction, EmbedFooterData, Message } from "discord.js";

import { Author } from "../template";

type Context = CommandInteraction | Message;

export interface EmbedStyleBase {
    author?: "invoker" | "bot";
    color?: number;
    footer?: EmbedFooterData;
}

export type embedStyle = {
    [prop in keyof EmbedStyleBase]:
        | EmbedStyleBase[prop]
        | ((ctx: Context) => EmbedStyleBase[prop]);
};

/** @private This should not be accessed directly, use `createEmbedStyle` function */
export class EmbedStyle {
    private style: embedStyle;

    constructor(style: embedStyle) {
        this.style = style;
    }

    private setStyle(ctx: Context, embed: Embed) {
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
     */
    use(ctx: Context) {
        return this.setStyle(ctx, new Embed());
    }

    /**
     * Apply styles on existing Embed
     *
     * Example Usage:
     * ```js
     * const embed = style.apply(ctx, generateHelpCommandAsEmbed())
     * ```
     */
    apply(ctx: Context, embed: Embed) {
        return this.setStyle(ctx, embed);
    }

    private resolve<T>(
        ctx: Context,
        res?: T | ((ctx: Context) => T)
    ): T | undefined {
        if (typeof res == "function") {
            // @ts-ignore Type System too complex, this is private fn anyway
            return res(ctx);
        }
        return res;
    }

    /**
     * Extends (or Override) this style
     *
     * @returns new EmbedStyle
     */
    extends(style: Partial<embedStyle>) {
        return new EmbedStyle({
            ...this.style,
            ...style,
        });
    }
}

/**
 * Create EmbedStyle Object
 *
 * Example Usage:
 * ```js
 * export const style = createEmbedStyle({ ... });
 * ```
 *
 * Embed Styles Properties:
 * - author: "invoker" will set the author to who invoke the commands
 * "bot" is bot, obviously.
 * - color: Color of Embed
 * - footer: Footer of Embed
 *
 * You can also pass the function that recieves Command Context and return the option.
 */
export function createEmbedStyle(style: embedStyle) {
    return new EmbedStyle(style);
}
