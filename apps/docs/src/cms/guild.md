# Specific-Guild Command

You may want some specific commands to be available to specific guilds,
this is where Specific-Guild Command is here.

First, when you create a Command Center, you will need to add Guild IDS
to constructor arguments (or "Global"). This is default or base guild ids which will
be used for every commands.

```ts
new SlashCenter(client, ["1", "2"]);
```

For each command, you can override the guild ids it is targeting to,
by using `@Guild` decorator for Slash Command or pass it and second arguments
for Message Command

```ts
// Instead of syncing to 1 and 2 (Default), sync to 1 and 3 instead
@Guilds(["1", "3"])
@SlashCommand("A dangerous command that only exists in trusted guild")
async sql() {
    // ...
}

@MessageCommand({ description: "Pong!" }, ["1", "3"])
async pong() {
    // ...
}
```

The library will take care of unioning the guild ids, so you can think of them
as `Default` and `Override`

In other words, Guild Ids for a command is its Guild Ids, if not specified,
will be Cog's Guild Ids (coming soon), then Center's Guild Ids

### How does it works

For Message Command, if this feature is enabled 
(by specifying guild_ids in constructor), the library will check if the message
is created in the allowed guild and respond to it.

For Slash Command, the library will only sync the command to the guilds specified,
it also do a cleanup in case you change the values.
