import { store } from "../src/base";

describe("[store] Store", () => {
    class Checker {
        value = 0;
        changeValue(num: number) {
            this.value = num;
        }
    }

    const a = new Checker();
    const b = new Checker();
    const c = new Checker();

    it("Subscribe and Notify should work", () => {
        store.subscribe("bruh", () => {
            a.changeValue(2);
        });

        store.subscribe("bruh2", () => {
            b.changeValue(3);
        });

        store.notify("bruh");

        expect(a.value).toEqual(2);
        expect(b.value).toEqual(0);

        store.notify("bruh2");

        expect(a.value).toEqual(2);
        expect(b.value).toEqual(3);
        expect(c.value).toEqual(0);
    });
});
