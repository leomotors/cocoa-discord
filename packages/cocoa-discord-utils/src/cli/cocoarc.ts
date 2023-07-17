import { OptionValues, program } from "commander";
import { readFileSync } from "node:fs";

let opts: OptionValues;

export function getOpts() {
  if (opts) return opts;
  return (opts = program.opts());
}

export interface cocoarcConfig {
  messagePath: string;
  slashPath: string;
}

let config: cocoarcConfig;

export function loadConfig(): cocoarcConfig {
  const cocoarc = getOpts().cocoarc;

  let rc: cocoarcConfig = {} as cocoarcConfig;
  try {
    rc = JSON.parse(readFileSync(cocoarc).toString());
  } catch (error) {}

  return {
    messagePath: rc.messagePath ?? "./src/commands/message",
    slashPath: rc.slashPath ?? "./src/commands/slash",
  };
}

export function getConfig() {
  if (config) return config;
  return (config = loadConfig());
}
