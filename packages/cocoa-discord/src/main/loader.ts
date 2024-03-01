import { readFile } from "node:fs/promises";

import chalk from "chalk";

export class Loader<T> {
  readonly name: string;
  protected _data: T;
  protected readonly filePath?: string;
  private reloadInterval?: NodeJS.Timeout;

  initialPromise?: Promise<void>;

  get data() {
    return this._data;
  }

  protected constructor(name: string, data: T, filePath?: string) {
    this.name = name;
    this._data = data;
    this.filePath = filePath;
  }

  static fromObject<T>(name: string, data: T) {
    return new Loader<T>(name, data);
  }

  static fromJson<T>(name: string, filePath: string) {
    const constructed = new Loader<T>(name, {} as T, filePath);
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
      console.log(chalk.green(`[LOADER ${this.name}] Successfully loadeded`));
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

export class ArrayLoader<T> extends Loader<T[]> {
  getRandom(): T | undefined {
    return this._data[Math.floor(Math.random() * this._data.length)];
  }

  static fromArray<T>(name: string, data: T[]) {
    return new ArrayLoader<T>(name, data);
  }

  /** Your json file **must be** array of object with type `T` */
  static fromFile<T>(name: string, filePath: string) {
    const constructed = new ArrayLoader<T>(name, [], filePath);
    constructed.initialPromise = constructed.reload();
    return constructed;
  }
}
