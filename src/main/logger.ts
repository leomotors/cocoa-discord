import chalk from "chalk";

export enum LogStatus {
    Normal,
    Warning,
    Error,
    Success,
    Special,
}

const LogStatusMap = [
    (s) => s,
    chalk.yellow,
    chalk.red,
    chalk.green,
    chalk.cyan,
] as Array<(s: string) => string>;

function _addZero(num: number) {
    return num < 10 ? `0${num}` : `${num}`;
}

export function getFormattedTime(simple = false) {
    const d = new Date();
    const year = d.getFullYear();
    const month = _addZero(d.getMonth() + 1);
    const day = _addZero(d.getDate());
    const hour = _addZero(d.getHours());
    const min = _addZero(d.getMinutes());
    const sec = _addZero(d.getSeconds());

    return simple
        ? `${year}${month}${day}${hour}${min}${sec}`
        : `${year}-${month}-${day} ${hour}:${min}:${sec}`;
}

export namespace Cocoa {
    export function format(message: string, status = LogStatus.Normal) {
        return LogStatusMap[status]!(`[${getFormattedTime()}] ${message}`);
    }

    export function log(message: string, status = LogStatus.Normal) {
        console.log(format(message, status));
    }
}
