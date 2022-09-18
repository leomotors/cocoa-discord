/// <reference types="node" />
import { exec } from "node:child_process";

for (const file of process.argv.slice(2)) {
    exec(`npx uglifyjs --compress -o ${file} -- ${file}`);
}
