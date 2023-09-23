# @cocoa-discord/music-module

[![](https://img.shields.io/npm/v/@cocoa-discord/music-module.svg?maxAge=3600)](https://www.npmjs.com/package/@cocoa-discord/music-module)
[![](https://img.shields.io/npm/dt/@cocoa-discord/music-module.svg?maxAge=3600)](https://www.npmjs.com/package/@cocoa-discord/music-module)
[![](https://github.com/Leomotors/music-bot/actions/workflows/test.yml/badge.svg)](https://github.com/Leomotors/music-bot/actions)

Music Bot components extracted from [harunon.js](https://github.com/CarelessDev/harunon.js)

## How to use

This package has 2 parts, the underlying mechanics and the part that consume it.

You likely only want to import complete Music Cog which is compatible to [cocoa-discord](https://github.com/Leomotors/cocoa-discord)

See Example at [tests/bot.js](./tests/bot.js)

Apart from that, if you can understand the code [src/voice.ts](src/voice.ts),
you can directly interact with api underneath, all of them is public.

### Minimal Usage

- Clone this repository, build the package and run tests/bot.js

- Adjust and add some codes to personalize the bot

### Advanced Usage

- Import music module to existing bot that use [Cocoa Discord](https://github.com/Leomotors/cocoa-discord)
  (See [cminusminus](https://github.com/Leomotors/cminusminus) for minimal example or [Waifu Bot](https://github.com/Leomotors/waifu-bot) for sized bot)

## Prerequisites

- node 18 (16 gone eol :skull:)

- **IMPORTANT** [Encoding Libraries](https://www.npmjs.com/package/@discordjs/voice#dependencies)
  (This library does not ship these encoding libraries, so you can freely decide which one to install)

## ✨Features

- play from YouTube

- queue

- pause / resume

- Loop

- Remove from Queue and Clear

- Search with beautiful embeds

## 🖼️ Highlight

- ✨ Search Feature

![](./images/search1.png)

![](./images/search2.png)

_Note: Picture from previous release, lazy to update_

## Note

- This module has its cog named "Music", be sure to not creating a duplicate name

- Some edge cases like user invoke command without being in voice channel might not be handled yet
