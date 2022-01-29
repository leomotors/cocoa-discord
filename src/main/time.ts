/**
 * @param time time in milliseconds ex. from `new Date.getTime()`
 * @returns Time in format of `4d 20h 6m 9s`
 *  */
export function parseTime(time: number) {
    time = Math.round(time);

    let sec = Math.floor(time / 1000);
    let min = Math.floor(sec / 60);
    let hr = Math.floor(min / 60);
    const day = Math.floor(hr / 24);

    sec %= 60;
    min %= 60;
    hr %= 24;

    return `${day > 0 ? `${day}d ` : ""}${hr > 0 ? `${hr}h ` : ""}${
        min > 0 ? `${min}m ` : ""
    }${sec}s`;
}
