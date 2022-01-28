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

**Note**: Command Management is inspired by discord.py's cogs system. 
There are two implementations, one that are different, focuses on concept of
one function per file. And the other one, that is more like discord.py's cogs.

### Experimental Modules

To use Class Cog (with Decorators like discord.py), import them from /message/class
or /slash/class.

Note that Decorators are complex and I achieve this using *dark magic*

## ✍️ Discord Bots that use this Package a.k.a. Examples

- [Cocoa Grader](https://github.com/Leomotors/cocoa-grader)

- [Harunon JS](https://github.com/CarelessDev/harunon.js) (Working on)

If you wish for examples, see above repositories

## 📚 Documentation

- See all type definitions/api at [TypeDoc](https://leomotors.github.io/cocoa-discord-utils/)

- Read about Command Management System [Here](./docs/cms.md)

**Note**: There is no Type Check in this package. To avoid unexpected behavior,
please use TypeScript or activate @ts-check on JavaScript.

Note that to use generic type, you need to use TypeScript.
