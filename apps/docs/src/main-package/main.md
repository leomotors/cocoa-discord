# Main

```ts
import { ... } from "cocoa-discord";
```

This module contains general utilities class and functions that will help you
save time writing your bots

_Note_: This documentation/guide is partially done.

## Table of Contents

[[toc]]

## [Class] CocoaEmbed

`CocoaEmbed` is a class that derived `Embed` from `@discordjs/builders`

[Guild for Embed from discord.js](https://discordjs.guide/popular-topics/embeds.html#embed-preview)

_Full implementation_ [See Code](https://github.com/leomotors/cocoa-discord/blob/main/src/main/embed.ts)

<<< @/../../../packages/cocoa-discord/src/utils/embed.ts#CocoaEmbed

## [Function] setConsoleEvent

_Full Implementation, does what it say_

<<< @/../../../packages/cocoa-discord/src/utils/readline.ts#setConsoleEvent

Trigger handler everytime you press enter in the console

## [Class] ConsoleManager

Allow you to add command into console, the class also provide template for
`logout` and `reload` command

### Example Usage

```ts
new ConsoleManager().useLogout(client).useReload(activity);
```

---

For full list of functions, please look at [TypeDoc](https://cocoa.leomotors.me/typedoc/)
