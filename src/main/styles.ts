import { Embed } from "@discordjs/builders";

import { CommandInteraction, EmbedFooterData, Message } from "discord.js";

import { Author } from "../template";

type Context = CommandInteraction | Message;

interface embedStyleBase {
    author?: "invoker" | "bot";
    color?: number;
    footer?: EmbedFooterData;
}

export type embedStyle = {
    [prop in keyof embedStyleBase]:
        | embedStyleBase[prop]
        | ((ctx: Context) => embedStyleBase[prop]);
};

/** This should not be accessed directly, use `createEmbedStyle` function */
class EmbedStyle {
    style: embedStyle;

    constructor(style: embedStyle) {
        this.style = style;
    }

    use(ctx: Context) {
        let e = new Embed();

        const author = this.resolve(ctx, this.style.author);
        const color = this.resolve(ctx, this.style.color);
        const footer = this.resolve(ctx, this.style.footer);

        if (author == "invoker") e = e.setAuthor(Author(ctx));
        else if (author == "bot")
            e = e.setAuthor({
                name: ctx.client.user!.username,
                iconURL: ctx.client.user!.avatarURL() ?? "",
            });

        if (color) e = e.setColor(color);
        if (footer) e = e.setFooter(footer);

        return e;
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
}

export function createEmbedStyle(style: embedStyle) {
    return new EmbedStyle(style);
}
