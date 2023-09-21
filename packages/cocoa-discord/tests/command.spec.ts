import "./stub";

import { describe, expect, it } from "vitest";

import { ChatInputCommandInteraction, Client } from "discord.js";

import { MessageCenter, MessageModule } from "../src/message";
import { SlashCenter, SlashModule } from "../src/slash";
import { SlashFull, SlashModuleClass } from "../src/slash/class";

const client = new Client({ intents: [] });
const mcenter = new MessageCenter(client, { mention: true }, ["1", "2"]);
const scenter = new SlashCenter(client, ["123"]);

const CorrectMCog: MessageModule = {
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

const WrongMCog: MessageModule = {
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

const CorrectSCog: SlashModule = {
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

const WrongSCog: SlashModule = {
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
  describe("Help Command", helpCommand);
});

function testMessage() {
  it("Validation should Pass", () => {
    mcenter.addModules(CorrectMCog);
    mcenter.validateCommands();
  });

  it("Should be able to union guild_ids", () => {
    // @ts-ignore yeet: Access protected property
    const gids = mcenter.unionAllGuildIds();

    expect(gids).toStrictEqual(["1", "2", "3"]);
  });

  it("Validation should Fail (Illegal Cog: Command name mismatch)", () => {
    // @ts-ignore to yeet all the modules
    mcenter.modules = [];
    mcenter.addModules(WrongMCog);
    return expect(mcenter.validateCommands()).rejects.toBeTruthy();
  });

  it("Validation should Fail (Duplicate cog names)", () => {
    // @ts-ignore to yeet all the modules
    mcenter.modules = [];
    mcenter.addModules(CorrectMCog, CorrectMCog);
    return expect(mcenter.validateCommands()).rejects.toBeTruthy();
  });

  it("Check Criteria: Mention", () => {
    // @ts-ignore lol
    client.user = { id: "69420112116441112" };
    expect(
      // @ts-ignore yeeett
      mcenter.checkCriteria({
        content: "Hello <@69420112116441112>, you are SIMP",
      }),
    ).toEqual("Hello , you are SIMP");
  });

  it("Check Criteria: Prefixes", () => {
    // @ts-ignore lol
    mcenter.criteria = { prefixes: ["simp"] };

    expect(
      // @ts-ignore
      mcenter.checkCriteria({ content: "simpplay daydream cafe" }),
    ).toEqual("play daydream cafe");

    expect(
      // @ts-ignore
      mcenter.checkCriteria({ content: "play daydream cafe pls" }),
    ).toBeUndefined();
  });
}

function testSlash() {
  it("Validation should Pass", () => {
    scenter.addModules(CorrectSCog);
    scenter.validateCommands();
  });

  it("Should be able to union guild_ids", () => {
    // @ts-ignore yeet: Access protected property
    const gids = scenter.unionAllGuildIds();

    expect(gids).toStrictEqual(["123", "555"]);
  });

  it("Validation should Fail (Illegal Cog: Command name mismatch)", async () => {
    scenter.addModules(WrongSCog);
    return expect(scenter.validateCommands()).rejects.toBeTruthy();
  });

  it("Validation should Fail (Duplicate cog names)", async () => {
    // @ts-ignore to yeeeet all the modules
    scenter.modules = [];
    scenter.addModules(CorrectSCog, CorrectSCog);
    return expect(scenter.validateCommands()).rejects.toBeTruthy();
  });
}

function testClass() {
  it("Should equivalent to CorrectSCog, Decorator should resolve correctly", async () => {
    class CSCog extends SlashModuleClass {
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
      CorrectSCog.commands.test.command.name,
    );
    expect(cog.commands.play.command.name).toEqual(
      CorrectSCog.commands.play.command.name,
    );
    expect(cog.commands.test.guild_ids).toStrictEqual(["12345"]);
  });
}

function helpCommand() {
  it("Should generate fine", () => {
    const center = new MessageCenter(client, { prefixes: ["!"] });
    center.addModules(CorrectMCog);
    center.useHelpCommand();

    // @ts-ignore
    expect(center.modules.length).toBe(2);

    // @ts-ignore
    const help = center.modules[1];
    expect(help.name).toBe("Help");
    expect(Object.keys(help.commands).length).toBe(1);
    expect(help.commands.help?.command.name).toBe("help");
  });
}
