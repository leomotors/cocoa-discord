# Class Cog V2

Class Cog V2 is a new feature that is introduced along Cocoa Discord Utils V2

::: info NOTE

Class Cog V2 is currently only available for Slash Command only

:::

## Overview

In Class Cog V1, I have not take use of decorators that much. In V2 I am redesigning
the syntax of it. Yet, it will still eventually be compiled down to Object Cog for few main reasons

- Object Code is closest to Discord API Format. Also for compatibility with other type of commands.
- For cases where the new syntax does not support some types of command, you can
  still use older syntax to accomplish that with zero conflict.
- I'm lazy to rewrite them

The syntax now look something like this

```ts
@SlashCommand("The command that say hi to specific person")
async sayhi(
    ctx: SlashCommand.Context,

    @Param.String("Message to say")
    @Param.Choices(["Gay", "Bruh"])
    msg: Param.String.Type,

    @Param.User("User to greet")
    user: Param.User.Type

    @Param.Integer("Optional Parameter", { required: false })
    opt: Param.Integer.Nullable
) {
    // handle the interaction
}
```

::: tip

`required` is default to `true`, while `autocomplete` is default to `false`

Use `Param.[Type].Nullable` if you have set `required` to `false`

:::

This can now help you get rids of calling multiple functions to get the parameters
and avoid you from messing with `SlashCommandBuilder`, keep your code declarative,
easy and fin to read.

::: danger

Parameter Decorators are not type safe, meaning TypeScript will not complain
if you put in the wrong type. Make sure to annotate it with the correct type!

:::
