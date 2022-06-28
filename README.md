# Cocoa Discord Utils

[![](https://img.shields.io/npm/v/cocoa-discord-utils.svg?maxAge=3600)](https://www.npmjs.com/package/cocoa-discord-utils)
[![](https://img.shields.io/npm/dt/cocoa-discord-utils.svg?maxAge=3600)](https://www.npmjs.com/package/cocoa-discord-utils)
[![](https://github.com/Leomotors/cocoa-discord-utils/actions/workflows/caffemocha.yml/badge.svg)](https://github.com/Leomotors/cocoa-discord-utils/actions)
[![Codecov Coverage](https://img.shields.io/codecov/c/github/Leomotors/cocoa-discord-utils/main.svg?style=flat-square)](https://codecov.io/gh/Leomotors/cocoa-discord-utils/)

Yet another Discord Bot Utility npm package

*NOTE*: This Branch is for Version 2 which is currently under Beta and use discord.js 14 dev version, visit branch `v1` for stable version (which uses discord.js 13)

## ✨ Features

- Many utilities that **made by me for me** to make my bots

- Utilities that will help you reducing lines of code

- Automatic Activity Presence Management from Files

- Command Management (Message and Slash) System

- many more miscellanous utilities that my bots rely on

- Made for TypeScript

- Flexible, because this is not a framework, part of your bot can be constructed
using pure discord.js API

## 🛍️ Subpackages

Many utilities are classified into many subpackages

**NOTE**: You need to use the very new version of node.js (16.9+) as it is requirement
of discord.js

### /

Miscellanous, consists of many utility classes

### /meta

Info Stuff, ex. Utils Version, Device Info, etc.

### /message

Message Command Management

### /slash

Slash Command Management

### /template

Frequently used stuff

### /internal

As the name suggests, you should avoid touching this subpackage

### /message/class & /slash/class

To use Class Cog (with Decorators like discord.py), import them from /message/class
or /slash/class.

**TypeScript is required to use Decorators**.

**Note**: Command Management is inspired by discord.py's cogs system. 
There are two implementations, one that are different, focuses on concept of
one function per file. And the other one, that is more like discord.py's cogs.

## ✍️ Discord Bots that use this Package a.k.a. Examples

- [Cocoa Grader](https://github.com/Leomotors/cocoa-grader)

- [Harunon JS](https://github.com/CarelessDev/harunon.js)

- [Bots Gulag](https://github.com/CarelessDev/bots-gulag)

If you wish for examples, see above repositories

## ✏️ Templates

Templates are available at /templates

You can use [degit](https://www.npmjs.com/package/degit) to clone the template

Example:

```bash
npx degit leomotors/cocoa-discord-utils/templates/slash-only my-bot
```

## 📚 Documentation

- Doc & Guide: [LINK](https://leomotors.github.io/cocoa-discord-utils)

**Note**: For runtime safety, **please use TypeScript** or activate @ts-check on JavaScript.

To use generic type and decorators (Cog Class Syntax), TypeScript is required.

**Tips**: Always use *await* with any async methods, so try-catch works.

## 🍫 What is Cocoa?

Cocoa may have many meanings, but the name `Cocoa / ココア` that is used in this package as well as `cocoa-grader` refers to Cocoa Oneechan `保登心愛 from ご注文はうさぎですか？`

![](https://c.tenor.com/82-e-VM5qNwAAAAC/gochiusa-cocoa.gif)

*nigerundayo... Smokey!* — No one said

Anime Name: [Is the Order a Rabbit?](https://myanimelist.net/anime/21273/Gochuumon_wa_Usagi_Desu_ka)

PS. This library has nothing to do with Cocoa (besides targeting Cocoa Grader
which is just Waifu Discord Bot)
