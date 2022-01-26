import chalk from "chalk";
import { ActivityOptions, Client, ExcludeEnum } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import { readFile } from "fs/promises";

import { Loader } from "./classes/loader";

const _5min = 5 * 60 * 1000;

/**
 * @important This function **must** be called **AFTER** client is ready
 */
export async function useActivity(
    client: Client<true>,
    loader: Loader<ActivityOptions>,
    interval = _5min
) {
    await loader.initialPromise;
    client.user.setActivity(loader.getRandom());
    setInterval(() => {
        client.user.setActivity(loader.getRandom());
    }, interval);
}

/**
 * @important This function **must** be called **AFTER** client is ready
 */
export async function useActivityGroup(
    client: Client<true>,
    loader: ActivityGroupLoader,
    interval = _5min
) {
    await loader.initialPromise;
    client.user.setActivity(loader.getBuiltRandom());
    setInterval(() => {
        client.user.setActivity(loader.getBuiltRandom());
    }, interval);
}

export type usableActivityType = ExcludeEnum<typeof ActivityTypes, "CUSTOM">;

export type ActivityGroup = {
    [type in usableActivityType]?: string[];
};

export class ActivityGroupLoader extends Loader<ActivityGroup> {
    private builtData: ActivityOptions[] = [];

    constructor(filePath: string) {
        super("Activity Group Loader", [], filePath);
        this.initialPromise = this.reload();
    }

    getBuiltRandom(): ActivityOptions {
        return this.builtData[
            Math.floor(Math.random() * this.builtData.length)
        ];
    }

    override async reload() {
        if (!this.filePath) {
            console.log(
                chalk.yellow(`[Loader ${this.name} WARN] No file path to load`)
            );
            return;
        }

        try {
            const buffer = await readFile(this.filePath);
            const data: ActivityGroup = JSON.parse(buffer.toString());

            const building: ActivityOptions[] = [];
            for (const [type, activities] of Object.entries(data)) {
                for (const activity of activities) {
                    building.push({
                        type: type as usableActivityType,
                        name: activity,
                    });
                }
            }

            this.builtData = building;

            console.log(
                chalk.green(
                    `[LOADER ${this.name}] Successfully loaded ${this.builtData.length} items`
                )
            );
        } catch (error) {
            console.log(chalk.red(`[LOADER ${this.name} ERROR] : ${error}`));
        }
    }
}
