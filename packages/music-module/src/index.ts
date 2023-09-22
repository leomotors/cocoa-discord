export * from "./config.g.js";

export { CocoaVersion } from "cocoa-discord/meta";

export { Music } from "./modules/music.module.js";
export * as Service from "./modules/music.service.js";

export * from "./core/voice.js";
export * from "./core/types.js";

export * from "./adapters/youtube.js";

// TEMP See: https://github.com/play-dl/play-dl/issues/357
export * from "./patch.js";
