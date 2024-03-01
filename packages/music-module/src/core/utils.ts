/**
 * Get last element of an array, returns undefined if array is empty
 *
 * Implemented by arr[arr.length - 1]
 */
export function pickLast<T>(arr: T[]) {
  return arr[arr.length - 1];
}

/**
 * Parse seconds into `m:ss` format
 */
export function parseLength(seconds: number) {
  const minutes = Math.floor(seconds / 60);

  seconds %= 60;

  return `${minutes}:${seconds >= 10 ? `${seconds}` : `0${seconds}`}`;
}

/**
 * Only works on positive number, inserts space every 3 digits
 */
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
