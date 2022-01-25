import { assert } from "chai";

import { Client } from "discord.js";

import { CogMessage, MessageCenter } from "../src/message";
import { CogSlash, SlashCenter } from "../src/slash";

const client = new Client({ intents: [] });
const mcenter = new MessageCenter(client, { mention: true });
const scenter = new SlashCenter(client, ["123"]);

const CorrectMCog: CogMessage = {
    name: "Cocoa",
    commands: {
        test: {
            command: {
                name: "test",
            },
            func: async (msg) => {},
        },
        play: {
            command: {
                name: "play",
            },
            func: async (msg) => {},
        },
    },
};

const WrongMCog: CogMessage = {
    name: "Wrong Cocoa",
    commands: {
        play: {
            command: {
                name: "test",
            },
            func: async (ctx) => {},
        },
        test: {
            command: {
                name: "play",
            },
            func: async (ctx) => {},
        },
    },
};

const CorrectSCog: CogSlash = {
    name: "Cocoa",
    commands: {
        test: {
            command: {
                name: "test",
                description: "bruh",
            },
            func: async (ctx) => {},
        },
        play: {
            command: {
                name: "play",
                description: "bruh",
            },
            func: async (ctx) => {},
        },
    },
};

const WrongSCog: CogSlash = {
    name: "Cocoa",
    commands: {
        play: {
            command: {
                name: "test",
                description: "bruh",
            },
            func: async (ctx) => {},
        },
        test: {
            command: {
                name: "play",
                description: "bruh",
            },
            func: async (ctx) => {},
        },
    },
};

describe("/message & /slash", () => {
    describe("Message Center", testMessage);
    describe("Slash Center", testSlash);
});

function testMessage() {
    it("Validation should Pass", () => {
        mcenter.addCogs(CorrectMCog);
        mcenter.validateCommands();
    });

    it("Validation should Fail (Illegal Cog: Command name mismatch)", () => {
        mcenter.addCogs(WrongMCog);
        assert.throws(() => mcenter.validateCommands());
    });

    it("Validation should Fail (Duplicate cog names)", () => {
        // @ts-ignore to yeet all the cogs
        mcenter.cogs = [];
        mcenter.addCogs(CorrectMCog, CorrectMCog);
        assert.throws(() => mcenter.validateCommands());
    });

    it("Check Criteria: Mention", () => {
        // @ts-ignore lol
        client.user = { id: "69420112116441112" };
        assert.equal(
            // @ts-ignore yeeett
            mcenter.checkCriteria({
                content: "Hello <@69420112116441112>, you are SIMP",
            }),
            "Hello , you are SIMP"
        );
    });

    it("Check Criteria: Prefixes", () => {
        // @ts-ignore lol
        mcenter.criteria = { prefixes: ["simp"] };
        assert.equal(
            // @ts-ignore
            mcenter.checkCriteria({ content: "simpplay daydream cafe" }),
            "play daydream cafe"
        );
        assert.isUndefined(
            // @ts-ignore
            mcenter.checkCriteria({ content: "play daydream cafe pls" })
        );
    });
}

function testSlash() {
    it("Validation should Pass", () => {
        scenter.addCogs(CorrectSCog);
        scenter.validateCommands();
    });

    it("Validation should Fail (Illegal Cog: Command name mismatch)", () => {
        scenter.addCogs(WrongSCog);
        assert.throws(() => scenter.validateCommands());
    });

    it("Validation should Fail (Duplicate cog names)", () => {
        // @ts-ignore to yeeeet all the cogs
        scenter.cogs = [];
        scenter.addCogs(CorrectSCog, CorrectSCog);
        assert.throws(() => scenter.validateCommands());
    });
}
