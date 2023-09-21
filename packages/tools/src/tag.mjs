// @ts-check

/**
 * @typedef {Object} Result
 * @property {string} packageName
 * @property {string} packageTitle
 * @property {string} packagePath
 * @property {string} version
 * @property {string} tag
 */

/**
 *
 * @param {string} refName
 * @returns {Result}
 */
export function getTag(refName) {
  const tokens = refName.split("@");

  if (tokens.length < 2 || tokens.length > 3) {
    throw new Error(`Invalid refName: ${refName}`);
  }

  const packageName = tokens[0].length ? tokens[0] : `@${tokens[1]}`;

  if (!/^(@[a-z0-9-]+\/)?[a-z0-9-]+$/.test(packageName)) {
    throw new Error(`Invalid package name: ${packageName}`);
  }

  const packageShortName = packageName.split("/").at(-1);

  if (!packageShortName) {
    throw new Error("Impossible error");
  }

  const packageTitle = packageShortName
    .split("-")
    .map((s) => s[0].toUpperCase() + s.slice(1))
    .join(" ");
  const packagePath = "packages/" + packageShortName;

  const version = tokens[tokens.length - 1];

  if (!/^\d+\.\d+\.\d+/.test(version)) {
    throw new Error(`Invalid version: ${version}`);
  }

  const tag = ["dev", "next", "beta", "pre", "rc"].some((t) =>
    version.includes(t),
  )
    ? "beta"
    : "latest";

  return {
    packageName,
    packageTitle,
    packagePath,
    version,
    tag,
  };
}

if (process.env.NODE_ENV !== "test") {
  console.log(JSON.stringify(getTag(process.argv[2])));
}
