import chalk from "chalk";
import { readFile } from "fs/promises";

export class Loader<T> {
    readonly name: string;
    private _data: T[] = [];
    protected readonly filePath?: string;
    private reloadInterval?: NodeJS.Timer;
    initialPromise?: Promise<void>;

    get data(): T[] {
        return this._data;
    }

    getRandom(): T | undefined {
        return this._data[Math.floor(Math.random() * this._data.length)];
    }

    protected constructor(name: string, data: T[], filePath?: string) {
        this.name = name;
        this._data = data;
        this.filePath = filePath;
    }

    static fromArray<T>(name: string, data: T[]): Loader<T> {
        const constructed = new Loader<T>(name, data);
        return constructed;
    }

    /** Your json file **must be** array of object with type `T` */
    static fromFile<T>(name: string, filePath: string): Loader<T> {
        const constructed = new Loader<T>(name, [], filePath);
        constructed.initialPromise = constructed.reload();
        return constructed;
    }

    async reload() {
        if (!this.filePath) {
            console.log(chalk.yellow("[Loader WARN] No file path to load"));
            return;
        }

        try {
            const buffer = await readFile(this.filePath);
            this._data = JSON.parse(buffer.toString());
            console.log(
                chalk.green(
                    `[LOADER ${this.name}] Successfully loaded ${this._data.length} items`
                )
            );
        } catch (error) {
            console.log(chalk.red(`[LOADER ${this.name} ERROR] : ${error}`));
        }
    }

    /**
     * Reload this loader every specified time, will reset previous interval
     */
    setReloadInterval(interval: number) {
        if (this.reloadInterval) clearInterval(this.reloadInterval);

        this.reloadInterval = setInterval(this.reload.bind(this), interval);
    }
}
