# Migration from Version 1

Version 2 has many changes, it also upgraded to discord.js 14 so you can expect
changes from discord.js too

::: warning Note

Not all changes are noted here

:::

## Summary

- Type Name and Builders Stuff changed in discord.js

- Many Type Name has been renamed

- Added many new mechanism

- TypeScript should be able to tell you that this no longer works

## Activity and Loader

- `useActivity()` and `useActivityGroup()` is removed, use `ActivityManager` instead.

- loader's `getRandom()` now returns `T | undefined`

- `Loader` is renamed to `ArrayLoader`

- `Loader` is added to handle Object (`{}`)
