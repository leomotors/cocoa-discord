# Other utility features

## Help Command

Both `MessageCenter` and `SlashCenter` is capable of generating help command, make sure to call them in right order.

The help command is named `help` in `Help` Cog, so beware not to create cog or command with the same name.

```js
scenter.addCogs( /* all your cogs */);
// * Help Command, must be called after All Cogs are added
scenter.useHelpCommand(style);
// * BUT before Validate Commands
scenter.validateCommands();
scenter.on("error", /* if you wanna set */);
// * REMINDER: syncCommands should be used in client.on("ready")
```

## Event Handler

[Event Handler for Management Center](./event.md)

## PS

See [cocoa-grader](https://github.com/Leomotors/cocoa-grader) and [harunon.js](https://github.com/CarelessDev/harunon.js)
