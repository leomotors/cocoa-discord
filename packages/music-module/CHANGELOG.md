# Changelog

All notables change for @leomotors/music-bot will be noted here

## [1.0.0] - 2023-09-??

- chore: bump deps
- style: format prettier 3
- refactor!: remove namespace
- feat!: partially rewritten to make it more customizable, ex: Playable interface
- refactor!: remove subscribers and like from embed, so extra data fetch is not needed
- refactor!: remove time progress from /now

## [0.24.0] - 2023-03-19

- chore: bump deps, this will fix bug that caused connections to drop off

## [0.23.0] - 2022-12-12

- chore: bump deps
- refactor: Migrated to new ESModule Standard (that shit one that force you to add .js on import),
  this mean you no longer need `-es-module-specifier-resolution=node`
  and it now supports `moduleResolution` of `node16` or `nodenext` for TypeScript
- refactor: deprecated APIs
- fix: a bug where the bot can no longer play music on that server after /clear is used

## [0.22.0] - 2022-11-16

- fix: export MusicService

## [0.21.0] - 2022-11-16

- chore: bump deps

## [0.20.1] - 2022-09-18

- chore: bump deps

## [0.20.0] - 2022-09-04

- [BREAKING] Switched to `play-dl`, schema changed
- [Experimental] Add playlist
- [BREAKING] Some dependencies are now peer dependencies

## [0.15.1] - 2022-07-18

- Upgraded to discord.js 14!

## [0.9.0] - 2022-06-22

- Update to `cocoa-discord-utils` 1.9 which supports `discord.js` 13.8

## [0.7.0] - 2022-06-11

- Fixed bugs in /now
- Update /now

## [0.5.0] - 2022-06-09

- Added /now

## [0.4.0] - 2022-05-06

- The bot now tell user if it is attempting to joining empty or not joinable functions

- Add /rejoin to force bot to join the voice channel

## [0.3.0] - 2022-05-03

- Fixed an issue where all server share the same music state (Reference and Value Stuff, again)
