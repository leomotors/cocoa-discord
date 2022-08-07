# Other utility features

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

[Event Handler for Management Center](./event.md)

## PS

See [cocoa-grader](https://github.com/Leomotors/cocoa-grader) and [harunon.js](https://github.com/CarelessDev/harunon.js)

## Advanced Feature: Specific-Guild Command

You may want some specific commands to be available to specific guilds,
this is where Specific-Guild Command is here.

First, when you create a Command Center, you will need to add Guild IDS
to constructor arguments. This is default or base guild ids which will
be used for every commands.

```ts
new SlashCenter(client, [1, 2]);
```

For each command, you can override the guild ids it is targeting to,
by adding field `guild_ids` for Object Cog, or `second argument` in Class Cog.

```ts
// Instead of syncing to 1 and 2 (Default), sync to 1 and 3 instead
@SlashCommand(AutoBuilder(...), [1, 3])
```

The library will take care of unioning the guild ids, so you can think of them
as `Default` and `Override`

### How does it works

For Message Command, if this feature is enabled 
(by specifying guild_ids in constructor), the library will check if the message
is created in the allowed guild and respond to it.

For Slash Command, the library will only sync the command to the guilds specified,
it also do a cleanup in case you change the values.
