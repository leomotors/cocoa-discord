import chalk from "chalk";
import { Client, Message } from "discord.js";

import { CogMessage } from "./Interfaces";
import { NonEmptyArray } from "../shared";
import { CogMessageClass } from "./class";

export type MessageCriteria =
    | ({ prefixes: NonEmptyArray<string> } & { mention?: false })
    | ({ mention: true } & { prefixes?: undefined });

export class MessageCenter {
    private readonly client: Client;
    private readonly criteria: MessageCriteria;
    private cogs: CogMessage[] = [];
    private validated = false;

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

    addCog(cog: CogMessage | CogMessageClass) {
        this.cogs.push(cog);
    }

    addCogs(...cogs: NonEmptyArray<CogMessage | CogMessageClass>) {
        this.cogs.push(...cogs);
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

    /**
     * No multiple Cogs or commands should have same name,
     * and `Cog.commands` key and value must be the same command name
     *
     * This function will ensure that and should be called after all cogs are added
     */
    validateCommands() {
        const cogNames = [];
        const cmdNames = [];
        for (const cog of this.cogs) {
            cogNames.push(cog.name);
            for (const [name, cmd] of Object.entries(cog.commands)) {
                cmdNames.push(name);
                if (name != cmd.command.name)
                    throw Error("Command name mismatch");
            }
        }

        if (new Set(cogNames).size !== cogNames.length)
            throw Error("Duplicate cog names");

        if (new Set(cmdNames).size !== cmdNames.length) {
            throw Error("Duplicate command names");
        }

        this.validated = true;
    }
}
