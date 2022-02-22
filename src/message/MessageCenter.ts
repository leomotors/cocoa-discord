import chalk from "chalk";
import { Client, Message } from "discord.js";

import { Awaitable, ManagementCenter, NonEmptyArray } from "../base";
import { EmbedStyle } from "../main";

import { CogMessageClass } from "./class";
import { CogMessage } from "./Interfaces";

export type MessageCriteria =
    | ({ prefixes: NonEmptyArray<string> } & { mention?: false })
    | ({ mention: true } & { prefixes?: undefined });

export interface MessageEvents {
    error: (name: string, error: unknown, msg: Message) => Awaitable<void>;
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
        super(client, "Message", { error: [] });
        this.criteria = criteria;

        this.client.on("messageCreate", (message: Message) => {
            if (message.author.bot) return;

            const suffix = this.checkCriteria(message);

            if (suffix) this.handleMessage(message, suffix);
        });

        setTimeout(() => {
            if (!this.validated)
                console.log(
                    chalk.yellow(
                        "[Message Center WARN]: Please validate command by using checkLogin()"
                    )
                );
        }, 5000);
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
                    console.log(
                        chalk.red(
                            `[Message Command: ${cmdName} ERROR] : ${error}`
                        )
                    );
                    if (this.hasHandler("error"))
                        await this.runAllHandler(
                            "error",
                            cmdName,
                            error,
                            message
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
                            await this.runAllHandler(
                                "error",
                                cmd.command.name,
                                error,
                                message
                            );
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

    override useHelpCommand(style?: EmbedStyle) {
        this.validated = false;
        const emb = this.generateHelpCommandAsEmbed();

        this.addCog({
            name: "Help",
            commands: {
                help: {
                    command: {
                        name: "help",
                        description: "Show help for all commands",
                    },
                    func: async (msg) => {
                        await msg.reply({
                            embeds: [style ? style.apply(msg, emb) : emb],
                        });
                    },
                },
            },
        });
    }
}
