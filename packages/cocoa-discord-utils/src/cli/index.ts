#!/usr/bin/env node
import chalk from "chalk";
import { program } from "commander";

import { CocoaVersion } from "../meta";

import create from "./create";

program
    .name("cocoadu")
    .description("CLI for Cocoa Discord Utils (Preview)")
    .version(CocoaVersion);

program
    .command("create")
    .description("Create a Command (Object Syntax)")
    .argument("<type>", "Type of Command")
    .argument("<name>", "Name of Command")
    .alias("c")
    .action(create);

program.option("-c, --cocoarc", "Configuration Files Path", "./.cocoarc");

console.log(
    chalk.rgb(224, 190, 171)`cocoadu, CLI for Cocoa Discord Utils
Cocoa Discord Utils Version: ${CocoaVersion}\n`
);

program.parse();
