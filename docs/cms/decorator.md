# Class Cog V2

**Note**: Class Cog V2 is currently only available for Slash Command Only

## Table of Contents

[[toc]]

## Overview

In Class Cog V1, I have not take use of decorators that much. In V2 we are redesigning
the syntax of it. Yet, it will still eventually be compiled down to Object Cog for few main reasons

- For compatibility with other type of commands.
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
) {
    // handle the interaction
}
```

This can now help you get rids of calling multiple functions to get the parameters
and avoid you from messing with `SlashCommandBuilder`
