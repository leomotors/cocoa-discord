# Changelog

All notables change for Cocoa Discord Utils will be noted here

## Note

- Changelog before 1.0.0-pre is not available here

- Not all change will be noted, see commits for *full* changelog

- Some pre-release build may not appear here

## [2.0.0-???] - ???

- feat(Help): Help by Command Name and Long Description

## [2.0.0-pre.2] - 2022-07-08

- Fix type incompatibility with Activity Manager

## [2.0.0-pre.1] - 2022-07-06

- The first pre-release of Version 2 is here!

## [1.9.0] - 2022-06-20

- Bump Deps

- Add support for discord.js 13.8 (ex. Attachments in Slash Command)

## [1.8.0] - 2022-05-03

- Add Log Function from [S-Bot-Framework](https://github.com/Leomotors/s-bot-framework)

## [1.7.0] - 2022-04-26

- (feat) ActivityGroup now supports URL field, note that only STREAMING type
  will show the URL to people

## [1.6.0] - 2022-04-21

- Fixed an issues that prevents help command from being generated for slash class

- Validating Commands for Slash Center is now `required`

## [1.5.0] - 2022-04-21

- Added @FutureSlash for Slash Command that cannot be resolve synchronously

## [1.4.2] - 2022-04-20

- Fix an issues that will cause the bot to not sync commands if help command is not added

## [1.4.1] - 2022-03-28

- Fix fatal bug that will fail every command with embed style `author: invoker`
when invoked by user with no avatar

## [1.4.0] - 2022-03-27

- Specfic-Guild Command for Message Center

- This library nows only create Readline Interface when you use the function
that require them. It also exports that interface for you in order to prevent
more than one interface being created. In addition to that, you can also provide
your interface.

## [1.3.0] - 2022-03-24

- Now prints number of commands when begin syncing

## [1.3.0-pre.1] - 2022-03-23

- Added new utility class `CocoaEmbed`

## [1.2.0] - 2022-03-22

- /meta: getTemp and getRAM now returns `null` if not applicable

- You can now use SlashCommandBuidler without needing to call .toJSON()
*this currently, only works on `CogSlashClass`*

## [1.2.0-pre.1] - 2022-03-09

- Each Slash Commands can target guilds independently

## [1.1.0] - 2022-03-07

- `createEmbedStyle` is no longer deprecated, it do the same as creating new class

## [1.1.0-rc.2] - 2022-02-27

- ConsoleManager's useReload supports function

## [1.1.0-rc.1] - 2022-02-24

- Some Interface Name has been changed

- Miscellanous improvements

## [1.1.0-pre.1] - 2022-02-23

- Deprecated `createEmbedStyle` => new EmbedStyle(...);

- Miscellanous Change (Text, Docs, Internal Typings)

- Added `AutoBuilder` for `CogSlashClass`

- Added "message" and "interaction" event for Message Center and Slash Center

## [1.0.0] - 2022-02-22

- @MessageCommand (CogMessageClass) no longer require 'name' field.
(You can still specify it to override what ever your method name is)

- Added `checkLogin()`

- Added ConsoleManager for more simple console command handling

- Added `setReloadInterval` method for Loader

- Miscellanous Changes

## [1.0.0-rc.5] - 2022-02-21

- Added Help Command Generator

## [1.0.0-rc.4] - 2022-02-20

- **BREAKING**: `ephemeral` is now `Ephemeral`, and some few interfaces have
their name changed

- Added `getEphemeral(ctx)` to shortly retrieve ephemeral option

## [1.0.0-rc.3] - 2022-02-09

- Updated Error Handling

- Marked Cog Class as stable

## [1.0.0-rc.2] - 2022-02-07

- Added Embed Style

- Added CLI (Preview)

## [1.0.0-rc.1] - 2022-01-30

- Author in /template supports Message

## [1.0.0-pre.12] - 2022-01-30

- Fix Partial Typo (Bot cannot recieve DM)

- Convert the package to commonjs & Bringing back Mocha Test

- Misc Improvement

## [1.0.0-pre.10] - 2022-01-29

- Fix Critical bug that prevent usage of options in /template

- Fix sysinfo.ts

- Added Template for Status Embed Fields

- Formatted and Brushed some codes

## [1.0.0-pre.9] - 2022-01-29

- Typing Changes

## [1.0.0-pre.8] - 2022-01-28

- Added alot

## [1.0.0-pre.5] - 2022-01-26

- I forgot

## [1.0.0-pre.2] - 2022-01-25

- Removed Unit Test, Because Mocha does not like ESModule, Muck ESModule

## [1.0.0-pre.1] - 2022-01-25

- Added a lot

### Left to do

- sysinfo.ts

- Try implement this on harunon.js and see if something more is needed
