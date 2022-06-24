# Main

Can be imported from /

```ts
import { ... } from "cocoa-discord-utils";
```

*Note*: This documentation/guide is partially done.

## Table of Contents

[[toc]]

## [Class] CocoaEmbed

`CocoaEmbed` is a class that derived `Embed` from `@discordjs/builders`

[Guild for Embed from discord.js](https://discordjs.guide/popular-topics/embeds.html#embed-preview)

*Part of implementation* [Full Code](../src/main/embed.ts)

```ts
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
    
    ...
}
```

## [Function] setConsoleEvent

*Full Implementation, does what it say*

```ts
export function setConsoleEvent(handler: (cmd: string) => void) {
    rl.on("line", (cmd: string) => {
        handler(cmd);
    });
}
```

Trigger handler everytime you press enter in the console

## [Class] ConsoleManager

Allow you to add command into console, the class also provide template for
`logout` and `reload` command

### Example Usage

```ts
new ConsoleManager().useLogout(client).useReload(activity);
```
