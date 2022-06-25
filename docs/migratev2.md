# Migration to V2

Cocoa Discord Utils V2 will implements discord.js 14

If your bot is using discord.js's class directly, you will need to do that
part of migration on your own.

Cocoa Discord Utils has done many internal migration, however users still
need actions in some changes.

Aside from that, the V2 also has other *few* breaking changes.

## Activity and Loader

- `use Activity() useActivityGroup()` is removed, please use `ActivityManager`

- loader's getRandom now returns `T | undefined`

- `Loader` is renamed to `ArrayLoader`

- `Loader` is added to handle Object

## CommandInteraction -> ChatInputCommandInteraction

What SlashCommand we are using all along is `ChatInputCommandInteraction`,
discord.js 14 now changes its name to correctly represent what it is doing

## Miscellanous Changes

TypeScript will warn you anyway, don't worry
