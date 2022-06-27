import "./stub";

import { describe, it, expect } from "vitest";

import { ChatInputCommandInteraction, Client } from "discord.js";

import { CogMessage, MessageCenter } from "../src/message";
import { CogSlash, SlashCenter } from "../src/slash";
import { CogSlashClass, SlashFull } from "../src/slash/class";

const client = new Client({ intents: [] });
const mcenter = new MessageCenter(client, { mention: true }, ["1", "2"]);
const scenter = new SlashCenter(client, ["123"]);

const CorrectMCog: CogMessage = {
    name: "Cocoa",
    commands: {
        test: {
            command: {
                name: "test",
            },
            func: async (msg) => {},
            guild_ids: ["3"],
        },
        play: {
            command: {
                name: "play",
            },
            func: async (msg) => {},
            guild_ids: ["1", "3"],
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
            guild_ids: ["555"],
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

describe("[command] /message & /slash", () => {
    describe("Message Center", testMessage);
    describe("Slash Center", testSlash);
    describe("Slash Class Cog", testClass);
});

function testMessage() {
    it("Validation should Pass", () => {
        mcenter.addCogs(CorrectMCog);
        mcenter.validateCommands();
    });

    it("Should be able to union guild_ids", () => {
        // @ts-ignore yeet: Access protected property
        const gids = mcenter.unionAllGuildIds();

        expect(gids).toStrictEqual(["1", "2", "3"]);
    });

    it("Validation should Fail (Illegal Cog: Command name mismatch)", () => {
        // @ts-ignore to yeet all the cogs
        mcenter.cogs = [];
        mcenter.addCogs(WrongMCog);
        return expect(mcenter.validateCommands()).rejects.toBeTruthy();
    });

    it("Validation should Fail (Duplicate cog names)", () => {
        // @ts-ignore to yeet all the cogs
        mcenter.cogs = [];
        mcenter.addCogs(CorrectMCog, CorrectMCog);
        return expect(mcenter.validateCommands()).rejects.toBeTruthy();
    });

    it("Check Criteria: Mention", () => {
        // @ts-ignore lol
        client.user = { id: "69420112116441112" };
        expect(
            // @ts-ignore yeeett
            mcenter.checkCriteria({
                content: "Hello <@69420112116441112>, you are SIMP",
            })
        ).toEqual("Hello , you are SIMP");
    });

    it("Check Criteria: Prefixes", () => {
        // @ts-ignore lol
        mcenter.criteria = { prefixes: ["simp"] };

        expect(
            // @ts-ignore
            mcenter.checkCriteria({ content: "simpplay daydream cafe" })
        ).toEqual("play daydream cafe");

        expect(
            // @ts-ignore
            mcenter.checkCriteria({ content: "play daydream cafe pls" })
        ).toBeUndefined();
    });
}

function testSlash() {
    it("Validation should Pass", () => {
        scenter.addCogs(CorrectSCog);
        scenter.validateCommands();
    });

    it("Should be able to union guild_ids", () => {
        // @ts-ignore yeet: Access protected property
        const gids = scenter.unionAllGuildIds();

        expect(gids).toStrictEqual(["123", "555"]);
    });

    it("Validation should Fail (Illegal Cog: Command name mismatch)", async () => {
        scenter.addCogs(WrongSCog);
        return expect(scenter.validateCommands()).rejects.toBeTruthy();
    });

    it("Validation should Fail (Duplicate cog names)", async () => {
        // @ts-ignore to yeeeet all the cogs
        scenter.cogs = [];
        scenter.addCogs(CorrectSCog, CorrectSCog);
        return expect(scenter.validateCommands()).rejects.toBeTruthy();
    });
}

function testClass() {
    it("Should equivalent to CorrectSCog, Decorator should resolve correctly", async () => {
        class CSCog extends CogSlashClass {
            constructor() {
                super("Cocoa");
            }

            @SlashFull({ name: "test", description: "bruh" }, ["12345"])
            async test(ctx: ChatInputCommandInteraction) {}

            @SlashFull({ name: "play", description: "bruh" })
            async play(ctx: ChatInputCommandInteraction) {}
        }
        const cog = new CSCog();
        await cog.presync();
        expect(cog.name).toEqual(CorrectSCog.name);
        expect(cog.description).toEqual(CorrectSCog.description);
        expect(cog.commands.test.command.name).toEqual(
            CorrectSCog.commands.test.command.name
        );
        expect(cog.commands.play.command.name).toEqual(
            CorrectSCog.commands.play.command.name
        );
        expect(cog.commands.test.guild_ids).toStrictEqual(["12345"]);
    });
}
