import { Awaitable } from "./Interface";

type PureFunction = () => Awaitable<void>;

class Store {
    private store: { [name: string]: PureFunction[] } = {};

    subscribe(name: string, func: PureFunction) {
        this.store[name] ??= [];
        this.store[name].push(func);
    }

    notify(name: string) {
        return this.store[name]?.map((fn) => fn());
    }

    async notifyAwait(name: string) {
        await Promise.all(this.notify(name));
    }
}

export const store = new Store();
