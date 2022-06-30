# Migration from Version 1

Version 2 has many changes, it also upgraded to discord.js 14 so you can expect
changes from discord.js too

*Note*: Not all changes will be noted here

## Summary

- Type Name and Builders Stuff changed in discord.js

- Many Type Name has been renamed

- Added many new mechanism

## Activity and Loader

- `use Activity() useActivityGroup()` is removed, please use `ActivityManager`

- loader's getRandom now returns `T | undefined`

- `Loader` is renamed to `ArrayLoader`

- `Loader` is added to handle Object
