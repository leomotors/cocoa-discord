# Command Management System

ah muck, I wrote this file for so long and accidently delete it.

*muck*

Anyway, let's get into the rewritten one, hope I don't delete it agian.

## Prerequisite

To understand this guide, you need to know:

- discord.js

- SlashCommandBuilder or JSON Structure of Slash Command

## Understand the Concept

The Command Management System in this library is inspired by discord.py's
cog system. It is similar but not identical to.

The Cog is a collection of Commands, and one bot may run multiple Cogs.

There are two implementations of the system.

1) Object Cog - Build on concept of one command per file.

2) Class Cog - Similar syntax to discord.py's Cog system.

Because I'm lazy with the reason given above. I'm going to talk only about
Slash Commands.

Message Commands will be similar to but have some important differences.
See [harunon.js](https://github.com/CarelessDev/harunon.js)

## Object Cog

### Create a Command

```ts
export const ping: CocoaSlash = {
    command: CocoaBuilder("ping", "pong!").toJSON(),
    func: async (ctx) => {
        await ctx.reply("pong!");
    },
}
```

**Note**: CocoaSlash is a utility function that returns SlashCommandBuilder

```ts
CocoaBuilder("ping", "pong!")
// Returns
new SlashCommandBuilder().setName("ping").setDescription("pong!")
// You can continue extend the SlashCommandBuilder normally
```

The goal of this function is to reduce the amount of frequently used code.

**Remark**:

- Cocoa Discord Utils does not provide Slash Command Builder,
you will need to use `SlashCommandBuilder` from `@discordjs/builders` or `CocoaBuilder` that will eventually returns `SlashCommandBuilder`

- Please refer to `discord.js` documents on how to handle interaction

Also, please keep in mind that this package is utility and not framework.

~~Because I ever made a framework that is easy to implement and it ends up
being a garbage. Visit [here](https://www.npmjs.com/package/s-bot-framework)~~

### Create a Cog

```ts
export const mainCog: CogSlash = {
    name: "Main Cog",
    description: "This is the main cog",
    commands: {
        ping,
    },
}
```

**Note**: The key of `commands` must match the name of its command in SlashCommandBuilder.
In order to ensure this, you are encouraged to run a function which will be
mentioned in the next section.

### Slash Command Center

```ts
const center = new SlashCenter(
    client,
    process.env.GUILD_IDS?.split(",") ?? []
);
// addCog for adding 1 Cog, addCogs for multiple Cogs
// However, addCogs also works on adding 1 Cog
center.addCogs(mainCog);
center.validateCommands();
```

`SlashCenter.validateCommands()` need to be called after all cogs are added
to ensure that the condition mentioned above is met.

## Class Cog

**Note**: This feature is achieved using dark magic. (See source code [here](../src/slash/class/index.ts))

However, it is working great ~~and is as stable as [S-Bot Framework](https://www.npmjs.com/package/s-bot-framework)~~.

It is marked as `stable` now.

**To use Class Cog**, We will need to extend the base class given,
and implement methods/commands with decorator.

The `CogClass` are based on Object Cog, so we can add it to management center
in the ~~same~~ similar way as the Object Cog.

*Definition for `CogSlashClass`*

```ts
export abstract class CogSlashClass implements CogSlash
```

**Example of Class Cog**

```ts
export class MainCog extends CogSlashClass {
    constructor() {
        super("Main Cog", "This is the main cog");
    }

    @SlashCommand(CocoaBuilder("ping", "pong!").toJSON())
    async ping(ctx: CommandInteraction) {
        await ctx.reply("pong!");
    }
}
```

And to add it to Slash Center

```ts
center.addCogs(new MainCog());
```

As CogSlashClass implements CogSlash, we can add it to Slash Center and even mix it with Object Cog.

**Note**: Due to some TypeScript mumbo jumbo, you are required to explicitly 
specify type in your method arguments.

*Argument Name can be changed, but must specify the correct type*

## Message Command

To invoke a message command, user need to meets two criteria.

- Mention or Global Prefix

- Command Name and Arguments

*Note: This is similar to discord.py's cogs*

### Message Center

```ts
const mcenter = new MessageCenter(client, { prefixes: ["simp"] });
```

*In this example, our bot will only listen to message with prefix simp*

```ts
class MainCog extends CogMessageClass {
    // constructor omitted

    @MessageCommand({
        // This can be omitted, the decorator will use `name` from function name
        // name: "ping",
        aliases: ["ing"],
        description: "pong!",
    })
    async ping(msg: Message, strp: string) {
        await msg.reply("pong!");
    }
}
```

User can invoke `ping` command by sending `simpping` or `simping`

`strp` (Stripped Content) is `message.content` that removed prefix or mentions
and command name

*For example*

```ts
// Command: play (using prefixes: ["simp"])
"simpplay The Rumbling"
// strippedContent is equal to
"The Rumbling"

// Command: submit (using mention: true)
"<@bot_id> submit cancel_1112 ```py\nimport os; os.system('sudo reboot');```"
// strippedContent is equal to
"cancel_1112 ```py\nimport os; os.system('sudo reboot');```"
```

*`message.content` is remained unmodified, you can access full message there too*

## Help Command

Both `MessageCenter` and `SlashCenter` is capable of generating help command, make sure to call them in right order.

The help command is named `help` in `Help` Cog, so beware not to create cog or command with the same name.

```js
scenter.addCogs( /* all your cogs */);
// * Help Command, must be called after All Cogs are added
scenter.useHelpCommand(style);
// * BUT before Validate Commands
scenter.validateCommands();
scenter.on("error", /* if you wanna set */);
// * REMINDER: syncCommands should be used in client.on("ready")
```

## Event Handler

[Event Handler for Management Center](./cms_evt.md)

## PS

See [cocoa-grader](https://github.com/Leomotors/cocoa-grader) and [harunon.js](https://github.com/CarelessDev/harunon.js)
