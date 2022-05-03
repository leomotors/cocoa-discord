import chalk from "chalk";
import { ActivityOptions, Client, ExcludeEnum } from "discord.js";
import { ActivityTypes } from "discord.js/typings/enums";
import { readFile } from "fs/promises";

import { Loader } from "./loader";

const _min = 60 * 1000;
const _defaultInterval = 10 * _min;

function assertInterval(interval: number) {
    if (interval < 1000) {
        throw "Interval too small! This will cause Rate-Limit, do never mistake milliseconds for seconds!";
    }
}

/** @important This function **must** be called **AFTER** client is ready */
export async function useActivity(
    client: Client<true>,
    loader: Loader<ActivityOptions>,
    interval = _defaultInterval
) {
    assertInterval(interval);

    await loader.initialPromise;
    client.user.setActivity(loader.getRandom());
    setInterval(() => {
        client.user.setActivity(loader.getRandom());
    }, interval);
}

/** @important This function **must** be called **AFTER** client is ready */
export async function useActivityGroup(
    client: Client<true>,
    loader: ActivityGroupLoader,
    interval = _defaultInterval
) {
    assertInterval(interval);

    await loader.initialPromise;
    client.user.setActivity(loader.getBuiltRandom());
    setInterval(() => {
        client.user.setActivity(loader.getBuiltRandom());
    }, interval);
}

export type usableActivityType = ExcludeEnum<typeof ActivityTypes, "CUSTOM">;

export type ActivityGroup = {
    [type in usableActivityType]?: Array<
        type extends ActivityTypes.STREAMING | "STREAMING"
            ? string | { name: string; url: string }
            : string
    >;
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
        ]!;
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
                    building.push(
                        typeof activity == "string"
                            ? {
                                  type: type as usableActivityType,
                                  name: activity,
                              }
                            : {
                                  type: type as usableActivityType,
                                  name: activity.name,
                                  url: activity.url,
                              }
                    );
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
