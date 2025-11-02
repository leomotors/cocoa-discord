import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/**/*.ts", "!src/**/*.spec.ts", "!src/**/__mocks__/**"],
  outDir: "dist",
  unbundle: true,
  define: {
    LIB_VERSION: JSON.stringify(process.env.npm_package_version || "unknown"),
    BUILD_TIME: JSON.stringify(new Date().toISOString()),
  },
});
