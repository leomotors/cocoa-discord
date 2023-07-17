import { Awaitable } from "./types.js";

export type PureFunction = () => Awaitable<void>;

export class Store {
  private store: { [name: string]: PureFunction[] } = {};

  subscribe(name: string, func: PureFunction) {
    this.store[name] ??= [];
    this.store[name]!.push(func);
  }

  notify(name: string) {
    return this.store[name]?.map((fn) => fn());
  }

  async notifyAwait(name: string) {
    await Promise.all(this.notify(name) ?? []);
  }
}

export const store = new Store();
