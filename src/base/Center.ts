import chalk from "chalk";
import { Client } from "discord.js";

import { BaseCommand, Cog as BaseCog, NonEmptyArray } from "./Interface";
import { MessageEvents } from "../message";
import { SlashEvents } from "../slash";

export abstract class ManagementCenter<
    Cog extends BaseCog<BaseCommand>,
    CogClass extends Cog,
    Events = MessageEvents | SlashEvents
> {
    protected readonly client: Client;
    protected cogs: Cog[] = [];
    protected validated = false;

    constructor(
        client: Client,
        protected eventHandler: {
            [event in keyof Events]: Events[event][];
        }
    ) {
        this.client = client;
    }

    addCog(cog: Cog | CogClass) {
        this.validated = false;
        this.cogs.push(cog);
    }

    addCogs(...cogs: NonEmptyArray<Cog | CogClass>) {
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
