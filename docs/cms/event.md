# Event Handler for Management Center

## Both Center: "error"

You can add a event listener to the Management Center.

```ts
// This one is Message Center, Slash Center is slightly different
center.on("error", (name, err, msg) => {
    console.log(chalk.red(`Command ${name} just error!`));
    await msg.channel.send(`Oops! This error occured: ${err.message}`);
});
// Note that you don't need to care if msg.channel.send will cause error
// Command Center will handle error from error handler as long as you `await`
```

Everytime an error occured in your command, this callback function will be called.

Use case is the case given above, the bot can reply to the user telling them directly what happened. So you don't need to check terminal to investigate.

The error handler is under try catch, as long as you await the potential harmful async function. It will be fine. Please note that we don't provide `on error error` event handler. That is too much.

**Tips**: It is always best practice to use `await` on every expression that is async including `message.reply` `message.channel.send` `ctx.reply` etc.

Otherwise, the try-catch might not be able to catch and your bot will *boom*

## Message Center: "message"

```ts
center.on("message", (name, msg) => {
    // do smth
});
```

This will be call after a message is handled by command if it exists.
Otherwise after it has been checked that this command does not exist.

`name` - The name of function handled, Empty String if is not handled (Not a command).

`msg` - Original Message Unmodified

## Slash Center: "interaction"

```ts
center.on("interaction", (name, ctx) => {
    // do smth
});
```

This will be call only if and after interaction is handled by command
(which in normal situation, *always*)
