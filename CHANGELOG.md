# Changelog

All notables change for Cocoa Discord Utils will be noted here

**Note**: Changelog before 1.0.0-pre is not available here

**Note 2**: Not all change will be noted, see commits for *full* changelog

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
