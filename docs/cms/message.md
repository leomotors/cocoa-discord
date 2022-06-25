# Message Command

To invoke a message command, user need to meets two criteria.

- Mention or Global Prefix

- Command Name and Arguments

*Note: This is similar to discord.py's cogs*

## Message Center

```ts
const mcenter = new MessageCenter(client, { prefixes: ["simp"] });
```

*In this example, our bot will only listen to message with prefix simp*

```ts
class MainCog extends CogMessageClass {
    // constructor omitted

    @MessageCommand({
        // This can be omitted, the decorator will use `name` from function name
        // name: "ping",
        aliases: ["ing"],
        description: "pong!",
    })
    async ping(msg: Message, strp: string) {
        await msg.reply("pong!");
    }
}
```

User can invoke `ping` command by sending `simpping` or `simping`

`strp` (Stripped Content) is `message.content` that removed prefix or mentions
and command name

*For example*

```ts
// Command: play (using prefixes: ["simp"])
"simpplay The Rumbling"
// strippedContent is equal to
"The Rumbling"

// Command: submit (using mention: true)
"<@bot_id> submit cancel_1112 ```py\nimport os; os.system('sudo reboot');```"
// strippedContent is equal to
"cancel_1112 ```py\nimport os; os.system('sudo reboot');```"
```

*`message.content` is remained unmodified, you can access full message there too*
