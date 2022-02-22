import { Embed } from "@discordjs/builders";

import chalk from "chalk";
import { Client } from "discord.js";

import { EmbedStyle } from "../main";
import { MessageEvents } from "../message";
import { SlashEvents } from "../slash";

import { BaseCommand, Cog as BaseCog, NonEmptyArray } from "./Interface";
import { store } from "./store";

export abstract class ManagementCenter<
    Cog extends BaseCog<BaseCommand>,
    CogClass extends Cog,
    Events = MessageEvents | SlashEvents
> {
    protected readonly client: Client;
    protected cogs: Cog[] = [];
    protected validated = false;

    helpText = "";
    helpEmbed?: Embed;

    private centerType: "Message" | "Slash";

    constructor(
        client: Client,
        centerType: "Message" | "Slash",
        protected eventHandler: {
            [event in keyof Events]: Events[event][];
        }
    ) {
        this.client = client;
        this.centerType = centerType;

        store.subscribe("login", this.validateCommands.bind(this));
    }

    addCog(cog: Cog | CogClass) {
        this.validated = false;
        this.cogs.push(cog);
    }

    addCogs(...cogs: NonEmptyArray<Cog | CogClass>) {
        this.validated = false;
        this.cogs.push(...cogs);
    }

    on<T extends keyof Events>(event: T, callback: Events[T]) {
        this.eventHandler[event].push(callback);
    }

    protected hasHandler(event: keyof Events) {
        return this.eventHandler[event].length > 0;
    }

    protected async runAllHandler<T extends keyof Events>(
        event: T,
        // @ts-ignore
        ...args: Parameters<Events[T]>
    ) {
        const futures = [];
        for (const handler of this.eventHandler[event])
            futures.push(
                (async () => {
                    try {
                        // @ts-ignore
                        await handler(...args);
                    } catch (error) {
                        console.log(
                            chalk.red(`[Event Handler ERROR: ${error}`)
                        );
                    }
                })()
            );
        await Promise.all(futures);
    }

    /**
     * Generate Cog that contains Help Command
     *
     * Should be called **after** all cogs are added and **before** commands validation.
     *
     * Make sure to **NOT** name any cog `Help` or any command `help`
     */
    useHelpCommand(_?: EmbedStyle) {
        throw "ManagementCenter is Abstract and also Private class, it's method is called";
    }

    /**
     * No multiple Cogs or commands should have same name,
     * and `Cog.commands` key and value must be the same command name
     *
     * This function will ensure that and should be called after all cogs are added
     *
     * **Note**: It is recommended to use `checkLogin()` instead for simplicity
     */
    validateCommands() {
        if (this.validated)
            console.log(
                chalk.yellow(
                    `[WARN ${this.centerType} Center] Validate should be called only once!`
                )
            );

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
            throw Error("Duplicate Cog names");

        if (new Set(cmdNames).size !== cmdNames.length) {
            throw Error("Duplicate Command names");
        }

        this.validated = true;
    }

    protected generateHelpCommand() {
        if (this.helpText) return this.helpText;

        for (const cog of this.cogs) {
            this.helpText += `<== **${cog.name}${
                cog.description ? ` - ${cog.description}` : ""
            }** ==>\n`;

            for (const [_, command] of Object.entries(cog.commands)) {
                const cmd = command.command;
                this.helpText += `${cmd.name}${
                    cmd.description ? ` - ${cmd.description}` : ""
                }\n`;
            }
        }

        return this.helpText;
    }

    protected generateHelpCommandAsEmbed() {
        if (this.helpEmbed) return this.helpEmbed;

        this.generateHelpCommand();

        this.helpEmbed = new Embed()
            .setTitle(`Help for ${this.centerType} Command`)
            .setDescription(this.helpText);

        return this.helpEmbed;
    }
}
