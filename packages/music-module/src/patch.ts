import fs from "node:fs/promises";
import { createRequire } from "node:module";

export async function patchPlayDl() {
  const require = createRequire(import.meta.url);

  const location = require.resolve("play-dl");

  const content = await fs.readFile(location, "utf-8");

  if (!content.includes("markersMap")) {
    throw new Error("Unable to patch play-dl: content to patch not found");
  }

  if (content.includes("markersMap?.find")) {
    console.warn("WARNING: play-dl is already patched");
    return;
  }

  const afterContent = content.replace("markersMap.find", "markersMap?.find");

  await fs.writeFile(
    location,
    "console.log('Using patched play-dl');" + afterContent,
  );

  console.log(`Patched play-dl at ${location}`);
}
