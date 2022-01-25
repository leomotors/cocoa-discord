import chalk from "chalk";
import { Client, Message } from "discord.js";

import { CogMessage, NonEmptyArray } from "./Interfaces";

export type MessageCriteria =
    | ({
          // * https://stackoverflow.com/a/49910890
          prefixes: NonEmptyArray<string>;
      } & { mention?: false })
    | ({ mention: true } & { prefixes?: undefined });

export class MessageCenter {
    private readonly client: Client;
    private readonly criteria: MessageCriteria;
    private cogs: CogMessage[] = [];

    constructor(client: Client, criteria: MessageCriteria) {
        this.client = client;
        this.criteria = criteria;

        this.client.on(
            "messageCreate",
            ((message: Message) => {
                if (message.author.bot) return;

                const suffix = this.checkCriteria(message);

                if (suffix) this.handleMessage(message, suffix);
            }).bind(this)
        );
    }

    addCog(cog: CogMessage) {
        this.cogs.push(cog);
    }

    addCogs(...cogs: CogMessage[]) {
        this.cogs.push(...cogs);
    }

    private checkCriteria(message: Message): string | undefined {
        if (this.criteria.mention) {
            return message.content.replace(/<@[!&#]{0,}[0-9]+>/g, "");
        }

        if (this.criteria.prefixes) {
            for (const prefix of this.criteria.prefixes) {
                if (message.content.startsWith(prefix)) {
                    return message.content.slice(prefix.length);
                }
            }
        }
    }

    private async handleMessage(message: Message, content: string) {
        const msgToken = content.split(" ");
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
                }
                return;
            }

            // * Call by Aliases
            for (const [fullName, cmd] of Object.entries(cog.commands)) {
                if (
                    cmd.command.aliases &&
                    cmd.command.aliases.includes(cmdName)
                ) {
                    try {
                        await cmd.func(message, msgToken.slice(1).join(" "));
                    } catch (error) {
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
