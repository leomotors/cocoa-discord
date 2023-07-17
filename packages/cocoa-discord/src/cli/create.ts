import chalk from "chalk";
import fs from "node:fs";

import { getConfig } from "./cocoarc";
import { messageTemplate } from "./template/message";
import { slashTemplate } from "./template/slash";

function writeTemplate(location: string, data: string) {
  if (fs.existsSync(location)) {
    console.log(chalk.red`Error: File ${location} already exists`);
    process.exit(1);
  }
  fs.writeFileSync(location, data);
}

export default function create(type: string, name: string) {
  if (type.startsWith("m")) {
    writeTemplate(
      `${getConfig().messagePath}/${name}.ts`,
      messageTemplate(name),
    );
    console.log(chalk.green`Created "${name}" Message Command`);
    return;
  }

  if (type.startsWith("s")) {
    writeTemplate(`${getConfig().slashPath}/${name}.ts`, slashTemplate(name));
    console.log(chalk.green`Created "${name}" Slash Command`);
    return;
  }

  throw "Cannot create Command: Invalid Command Type";
}
