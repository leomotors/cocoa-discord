import { defineWorkspace } from "vitest/config";

export default defineWorkspace([
  "./apps/docs/src/vite.config.ts",
  "./packages/music-module/vite.config.ts",
  "./packages/tools/vite.config.ts",
  "./packages/cocoa-discord/vite.config.ts",
]);
