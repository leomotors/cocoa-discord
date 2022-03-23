import * as fs from "fs";

import { Version, BuildTime } from "./src/meta/cocoa_meta.g";

let readme = fs.readFileSync("README.md").toString();

readme = readme.replace(
    "<TypeDoc />",
    `## For TypeDoc Reader

- You are viewing Documentation for Version ${Version}

- This Document is generated at ${BuildTime} (UTC+7)

- You can read the fancy Guide [HERE](./docs/index.html)`
);

fs.writeFileSync("README.g.md", readme);
