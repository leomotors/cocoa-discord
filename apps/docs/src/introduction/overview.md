# Overview

The Cocoa Discord contains a set of utilities seperated into multiple subpackages:

- main (/)
- /message
- /slash
- /message/class
- /slash/class
- /meta
- /template

Apart from miscellaneous utilities, it also come with powerful slash command (and message command) management system!

## Supports

- nodejs 16.9+ (discord.js requirements, 18 recommended as 16 going to EOL 💀)
- Only ESM is supported, TypeScript recommended (Experimental Decorators requires TypeScript)

## Installation

```bash
pnpm add cocoa-discord
```

or others up to your package manager.

It is recommended to not add discord.js as dependencies to avoid version conflict. (having more than one version)

::: warning Note

This document still lacks lot of documentation. Mostly because I'm lazy, and no one use this library anyway.

:::
