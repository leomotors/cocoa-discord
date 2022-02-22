import { assert } from "chai";

import { store } from "../src/base";

describe("Store", () => {
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

        assert.equal(a.value, 2);
        assert.equal(b.value, 0);

        store.notify("bruh2");

        assert.equal(a.value, 2);
        assert.equal(b.value, 3);
        assert.equal(c.value, 0);
    });
});
