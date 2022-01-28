import chalk from "chalk";
import { Client, Message } from "discord.js";

import { CogMessage } from "./Interfaces";
import { CogMessageClass } from "./class";
import { Awaitable, ManagementCenter, NonEmptyArray } from "../base";

export type MessageCriteria =
    | ({ prefixes: NonEmptyArray<string> } & { mention?: false })
    | ({ mention: true } & { prefixes?: undefined });

export interface MessageEvents {
    error: (error: unknown, msg: Message) => Awaitable<void>;
}

export class MessageCenter extends ManagementCenter<
    CogMessage,
    CogMessageClass,
    MessageEvents
> {
    private readonly criteria: MessageCriteria;

    /**
     * @param client - You know what this is
     * @param criteria - this may look complex but it basically means either
     * ```js
     * { mention: true }
     * ```
     * or
     * ```js
     * { prefixes: ["!", ...] }
     * ```
     * The prefixes can be anything as long as it is **not empty** string array
     */
    constructor(client: Client, criteria: MessageCriteria) {
        super(client, { error: [] });
        this.criteria = criteria;

        this.client.on(
            "messageCreate",
            ((message: Message) => {
                if (message.author.bot) return;

                const suffix = this.checkCriteria(message);

                if (suffix) this.handleMessage(message, suffix);
            }).bind(this)
        );

        setTimeout(
            (() => {
                if (!this.validated)
                    console.log(
                        chalk.yellow(
                            "[Message Center WARN]: Please validate command using .validateCommands()"
                        )
                    );
            }).bind(this),
            5000
        );
    }

    private checkCriteria(message: Message): string | undefined {
        if (this.criteria.mention) {
            const regex = new RegExp(`<@!*${this.client.user!.id}> *`, "g");
            const st = message.content.replace(regex, "");
            let sp = 0;
            while (st[sp] == " ") sp++;
            return st.slice(sp);
        }

        if (this.criteria.prefixes) {
            for (const prefix of this.criteria.prefixes) {
                if (message.content.startsWith(prefix)) {
                    return message.content.slice(prefix.length);
                }
            }
        }
    }

    private async handleMessage(message: Message, strp: string) {
        const msgToken = strp.split(" ");
        const cmdName = msgToken[0];

        for (const cog of this.cogs) {
            // * Call by Real Name
            if (cog.commands[cmdName]) {
                try {
                    await cog.commands[cmdName].func(
                        message,
                        msgToken.slice(1).join(" ")
                    );
                } catch (error) {
                    if (this.hasHandler("error"))
                        await this.runAllHandler("error", error, message);
                    else
                        console.log(
                            chalk.red(
                                `[Message Command: ${cmdName} ERROR] : ${error}`
                            )
                        );
                }
                return;
            }

            // * Call by Aliases
            for (const [fullName, cmd] of Object.entries(cog.commands)) {
                if (cmd.command.aliases?.includes(cmdName)) {
                    try {
                        await cmd.func(message, msgToken.slice(1).join(" "));
                    } catch (error) {
                        if (this.hasHandler("error"))
                            await this.runAllHandler("error", error, message);
                        else
                            console.log(
                                chalk.red(
                                    `[Message Command: ${fullName} ERROR] : ${error}`
                                )
                            );
                    }
                    return;
                }
            }
        }
    }
}
