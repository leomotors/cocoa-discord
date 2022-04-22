import { ActivityType } from "discord-api-types/v10";
import { ActivityOptions, Client } from "discord.js";

import chalk from "chalk";
import { readFile } from "fs/promises";

import { Loader } from "./loader";

const _min = 60 * 1000;
const _defaultInterval = 10 * _min;

function assertInterval(interval: number) {
    if (interval < 1000) {
        throw "Set Activity Interval too small! This will cause Rate-Limit and kill your bot, do never mistake milliseconds for seconds!";
    }
}

function doAndSetInterval(func: () => void, interval: number) {
    func();
    setInterval(func, interval);
}

function isGroupLoader(loader: Loader<unknown>): loader is ActivityGroupLoader {
    return (loader as ActivityGroupLoader).getBuiltRandom != undefined;
}

/** @important This function **must** be called **AFTER** client is ready */
export async function useActivity(
    client: Client<true>,
    loader: Loader<ActivityOptions> | ActivityGroupLoader,
    interval = _defaultInterval
) {
    assertInterval(interval);

    await loader.initialPromise;
    doAndSetInterval(
        isGroupLoader(loader)
            ? () => {
                  client.user.setActivity(loader.getBuiltRandom());
              }
            : () => {
                  client.user.setActivity(loader.getRandom());
              },
        interval
    );
}

type UsableActivity = NonNullable<ActivityOptions["type"]>;

export type ActivityGroup = {
    [type in UsableActivity]?: string[];
};

const activityToEnum: { [type: string]: UsableActivity } = {
    playing: ActivityType.Playing,
    streaming: ActivityType.Streaming,
    listening: ActivityType.Listening,
    watching: ActivityType.Watching,
    competing: ActivityType.Competing,
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
                const t = activityToEnum[type.toLowerCase()];

                if (typeof t == "undefined") continue;

                for (const activity of activities ?? []) {
                    building.push({
                        type: t,
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
