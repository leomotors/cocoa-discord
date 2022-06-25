import { exec } from "child_process";

for (const file of process.argv.slice(2)) {
    exec(`npx uglifyjs --compress -o ${file} -- ${file}`);
}
