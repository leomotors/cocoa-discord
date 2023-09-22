export function pickLast<T>(arr: T[]) {
  return arr[arr.length - 1];
}

export function parseLength(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  seconds %= 60;

  return `${minutes}:${seconds >= 10 ? `${seconds}` : `0${seconds}`}`;
}

/** Only works for positive number */
export function beautifyNumber(
  n: number | string | undefined | null,
  fallback = "Unknown",
) {
  if ((n ?? undefined) === undefined) return fallback;

  n = "" + n;

  let res = "";

  for (let i = 0; i < n.length; i++) {
    if ((n.length - i) % 3 === 0) {
      res += " ";
    }
    res += n[i];
  }

  return res.trim();
}
