import readline from "readline";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

/** On enter in console */
export function setConsoleEvent(handler: (cmd: string) => void) {
    rl.on("line", (cmd: string) => {
        handler(cmd);
    });
}
