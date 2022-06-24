# Command Management System

The core of discord bots are command.

## Table of Contents

[[toc]]

## Prerequisite

To understand this guide, you need to know:

- discord.js

- SlashCommandBuilder (@discordjs/builders) or JSON Structure of Slash Command

## How it works

### Message Command

Message Commands are very simple, so simple that we will talk about it next section.  
It basically recieve messages, process it by doing some actions and done.

### Slash Command

On the other hand, slash commands are more complex than message.

Slash Command has 2 parts, the command data and how we handle it.

```js
const command = {
    name: "ping",
    description: "Ping the Bot!"
};
```

The `command` object describe the command, this then need to be sent to discord,
so that they recognize our command and register them for user.

Note that apart from writing the pure JSON, `discord.js` provides `SlashCommandBuilder`
to help simplify things, the equivalent to above commands would be
```js
new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Ping the Bot!")
    .toJSON()
```

Then, on `interactionCreate` the event is sent to our bot that is running and we handle them.

So, preliminary concept is to create an object that contain both the slash command definition
and the handler of the command.  
And then create a library that organize and handle the sync and the interaction.  
So that, we can focus on writing only the command.

## The Cog Concept

The Command Management System in this library is inspired by discord.py's
cog system. It is similar but not identical to.

For this library, the Cog is a collection of Commands, usally categorized, and one bot may run multiple Cogs.

## Object Cog

This is the preliminary approaches to this library. Focuses on concept of 'one file per command'
(you can actually put multiple if you want so)

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
you will need to use `SlashCommandBuilder` from `discord.js` or `CocoaBuilder` that will eventually returns `SlashCommandBuilder`

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

As we have stated earlier, the Cog is collection of commands

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

## Introduction to Class Cog

As the complexity of the projects grow, I were looking for more simple syntax
and come up with the Class Cog syntax.

**Note**: The Class Syntax (Both V1 and V2 that I will talk about it soon) will
eventually compiled down to Object Cog.

- The only bot that still use *pure* Object Cog is [Cocoa Grader](https://github.com/Leomotors/cocoa-grader)

### The Syntax

*This syntax is inspired by discord.py*

## Class Cog V1

**To use Class Cog**, We will need to extend the base class given,
and implement methods/commands with decorator.

The `CogClass` are based on Object Cog, so we can add it to management center
in the ~~same~~ similar way as the Object Cog.

*Definition for `CogSlashClass`*

```ts
export abstract class CogSlashClass implements CogSlash
```

The approach of Class Cog is very similar to Object Cog. You basically define
the command handler as the method in a class. And slap the decorator with has
the command definition object. Just see it with your eye.

**Example of Class Cog**

```ts
export class MainCog extends CogSlashClass {
    constructor() {
        super("Main Cog", "This is the main cog");
    }

    // Normal Way
    @SlashCommand(CocoaBuilder("ping", "pong!").toJSON())
    async ping(ctx: ChatInputCommandInteraction) {
        await ctx.reply("pong!");
    }

    // NEW!
    @SlashCommand(AutoBuilder("pong!"))
    async ping(ctx: ChatInputCommandInteraction) {
        ...
    }
    // With AutoBuilder, you can omit the name field,
    // it will take the name from the method name
    // From 1.2.0, with CogSlashClass, you can omit .toJSON()

    // Always note that there is limitation on how you can name command
    // But discord.js will throw error at start time, so nothing to worry about
}
```

The library will automatically bind your method to an instance, so you can use
it like a class. Like, add some methods or properties!

And to add it to Slash Center just like Object Cog

```ts
center.addCogs(new MainCog());
```

Because CogSlashClass implements CogSlash, we can add it to Slash Center and even mix it with Object Cog.

**Note**: Due to some TypeScript mumbo jumbo, you are required to explicitly 
specify type in your method arguments.

*Argument Name can be changed, but must specify the correct type*

**Warning**: Extending Cog Class is not supported, decorators may behave unexpectly

