# Main

```ts
import { ... } from "cocoa-discord-utils";
```

This module contains general utilities class and functions that will help you
save time writing your bots

*Note*: This documentation/guide is partially done.

## Table of Contents

[[toc]]

## [Class] CocoaEmbed

`CocoaEmbed` is a class that derived `Embed` from `@discordjs/builders`

[Guild for Embed from discord.js](https://discordjs.guide/popular-topics/embeds.html#embed-preview)

*Full implementation* [See Code](https://github.com/Leomotors/cocoa-discord-utils/blob/main/src/main/embed.ts)

<<< @/../src/main/embed.ts#CocoaEmbed

## [Function] setConsoleEvent

*Full Implementation, does what it say*

<<< @/../src/main/readline.ts#setConsoleEvent

Trigger handler everytime you press enter in the console

## [Class] ConsoleManager

Allow you to add command into console, the class also provide template for
`logout` and `reload` command

### Example Usage

```ts
new ConsoleManager().useLogout(client).useReload(activity);
```

---

For full list of functions, please look at [TypeDoc](https://leomotors.me/cocoa-discord-utils/typedoc/)
