import { execSync } from "node:child_process";

/** @type {string} */
const ref = process.env.REF;

/**
 *
 * @param {string} version
 * @returns {boolean}
 */
function isPrerelease(version) {
  for (const kw of ["beta", "dev", "pre", "rc", "next"])
    if (version.includes(kw)) return true;
  return false;
}

const isPre = isPrerelease(ref);

const cmd = `pnpm publish --no-git-checks --tag ${isPre ? "beta" : "latest"}`;

execSync(cmd);
