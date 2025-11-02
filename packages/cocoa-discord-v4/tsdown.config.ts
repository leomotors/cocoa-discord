import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/**/*.ts", "!src/**/*.spec.ts"],
  outDir: "dist",
  unbundle: true,
});
