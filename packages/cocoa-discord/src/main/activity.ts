import chalk from "chalk";
import { ActivityType } from "discord-api-types/v10";
import { ActivityOptions, Client } from "discord.js";
import { readFile } from "node:fs/promises";

import { ArrayLoader } from "./loader.js";

const _min = 60 * 1000;
const _defaultInterval = 10 * _min;

export function isGroupLoader(
  loader: ArrayLoader<unknown>
): loader is ActivityGroupLoader {
  return (loader as ActivityGroupLoader).getBuiltRandom !== undefined;
}

export class ActivityManager {
  readonly loader: ArrayLoader<ActivityOptions> | ActivityGroupLoader;
  private readonly getRandomFunc: () => ActivityOptions | undefined;
  readonly client: Client;

  static assertInterval(interval: number) {
    if (interval < 1000) {
      throw "Set Activity Interval too small! This will cause Rate-Limit and kill your bot, do never mistake milliseconds for seconds!";
    }
  }

  /**
   * Set random activity periodically, note that you need to manually call
   * `nextActivity` after client is ready to set activity after login
   * otherwise you will need to wait `interval` for it to be set
   *
   * @param interval In milliseconds, if set to 0 will disable the periodic
   */
  constructor(
    loader: ArrayLoader<ActivityOptions> | ActivityGroupLoader,
    client: Client,
    interval = _defaultInterval
  ) {
    this.loader = loader;

    this.getRandomFunc = isGroupLoader(loader)
      ? loader.getBuiltRandom.bind(loader)
      : loader.getRandom.bind(loader);

    this.client = client;

    if (interval) {
      ActivityManager.assertInterval(interval);
      setInterval(() => this.nextActivity(), interval);
    }
  }

  /**
   * Set random activity
   *
   * @returns `true` if set, `false` if client is not ready
   */
  nextActivity() {
    if (!this.client.isReady()) return false;

    // TODO handle null
    this.client.user!.setActivity(this.getRandomFunc());
    return true;
  }
}

export type UsableActivity = NonNullable<ActivityOptions["type"]>;

export type ActivityGroup = {
  [type in UsableActivity]?: Array<string | Exclude<ActivityOptions, "type">>;
};

const activityToEnum: { [type: string]: UsableActivity } = {
  playing: ActivityType.Playing,
  streaming: ActivityType.Streaming,
  listening: ActivityType.Listening,
  watching: ActivityType.Watching,
  competing: ActivityType.Competing,
};

export class ActivityGroupLoader extends ArrayLoader<ActivityGroup> {
  private builtData: ActivityOptions[] = [];

  constructor(filePath: string) {
    super("Activity Group Loader", [], filePath);
    this.initialPromise = this.reload();
  }

  getBuiltRandom(): ActivityOptions | undefined {
    return this.builtData[Math.floor(Math.random() * this.builtData.length)];
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

        if (typeof t === "undefined") {
          throw Error(`Unknown Activity Type ${type}`);
        }

        for (const activity of activities ?? []) {
          if (typeof activity === "string")
            building.push({
              type: t,
              name: activity,
            });
          else
            building.push({
              type: t,
              name: activity.name,
              url: activity.url,
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
