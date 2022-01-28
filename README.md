# Cocoa Discord Utils

Yet another Discord Bot Utility npm package

This package contains many utilities that made by me for me to make my bots

## 🛍️ Subpackages

### / (index)

Miscellanous, consists of many utility classes

### /meta [Working on]

Info Stuff, ex. Utils Version, Device Info, etc.

### /message

Message Command Management

### /slash

Slash Command Management

### /template

Frequently used stuff

### /internal

As the name suggests

**Note**: Command Management is inspired by discord.py's cogs system. 
There are two implementations, one that are different, focuses on concept of
one function per file. And the other one, that is more like discord.py's cogs.

### Experimental Modules

To use Class Cog (with Decorators like discord.py), import them from /message/class
or /slash/class.

Note that Decorators are complex and I achieve this using *dark magic*

## ✍️ Discord Bots that use this Package a.k.a. Examples

- [Cocoa Grader](https://github.com/Leomotors/cocoa-grader)

- [Harunon JS](https://github.com/CarelessDev/harunon.js)

If you wish for examples, see above repositories

## 📚 Documentation

- See all type definitions/api at [TypeDoc](https://leomotors.github.io/cocoa-discord-utils/)

- Read about Command Management System [Here](./doc/cms.md)

**Note**: There is no Type Check in this package. To avoid unexpected behavior,
please use TypeScript or activate @ts-check on JavaScript.

Please note that to use generic type, TypeScript is required.

## 🍫 What is Cocoa?

Cocoa may have many meanings, but the name `Cocoa / ココア` that is used in this package as well as `cocoa-grader` refers to Cocoa Oneechan `保登心愛 from ご注文はうさぎですか？`

![](https://c.tenor.com/82-e-VM5qNwAAAAC/gochiusa-cocoa.gif)

*nigerundayo... Smokey!* — No one said

Anime Name: [Is the Order a Rabbit?](https://myanimelist.net/anime/21273/Gochuumon_wa_Usagi_Desu_ka)
