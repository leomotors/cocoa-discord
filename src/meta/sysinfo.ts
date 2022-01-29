import { exec as execCb } from "child_process";
import { promisify } from "util";

const exec = promisify(execCb);

/**
 * @returns CPU Temperature of Raspberry Pi,
 * if fails to do so (ex. not Raspberry Pi) returns -273
 * */
export async function getTemp() {
    try {
        const temp = await exec("vcgencmd measure_temp");
        const pst = +temp.stdout.split("=")[1].split("'")[0];
        if (isNaN(pst)) throw 0;
        return pst;
    } catch (error) {
        return -273;
    }
}

/** @returns [RAM Used, RAM Total] if available (Linux) otherwise [-1, -1]*/
export async function getRAM(): Promise<[number, number]> {
    try {
        const ram = await exec("free -m");
        const ln1 = ram.stdout
            .split("\n")[1]
            .split(" ")
            .filter((s) => s.length > 0);
        const ramUsed = +ln1[2];
        const ramCap = +ln1[1];
        if (isNaN(ramUsed) || isNaN(ramCap)) throw 0;
        return [ramUsed, ramCap];
    } catch (error) {
        return [-1, -1];
    }
}

/** @returns Uptime as `string` if available (linux) otherwise `null` */
export async function getLinuxUptime() {
    try {
        const ut = await exec("uptime");
        const sp = ut.stdout.split(",");
        let uptime = sp[0].split("up")[1].trim();
        if (uptime.includes("day")) uptime += " " + sp[1].trim();
        return uptime;
    } catch (err) {
        return null;
    }
}
