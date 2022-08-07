import { BuildTime, Version } from "./cocoa_meta.g";

/** Represents Current Version of Cocoa Discord Utils */
export const CocoaVersion = Version;

/**
 * Represents Time at which Current Build Cocoa Discord Utils is built, in UTC+7
 */
export const CocoaBuildTime = BuildTime;

export * from "./perf";
export * from "./sysinfo";
