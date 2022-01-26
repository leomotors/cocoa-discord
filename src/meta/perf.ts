export function getElapsed(from: number | Date, round = true) {
    const now = new Date().getTime();
    const elapsed = now - (from instanceof Date ? from.getTime() : from);
    return round ? Math.round(elapsed) : elapsed;
}
