import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    coverage: {
      reporter: ["text", "json", "html"],
      reportsDirectory: "../../coverage/cocoa-discord-v4",
      include: ["src/**/*.ts"],
      exclude: ["src/**/__mocks__/**", "src/**/*.spec.ts"],
    },
  },
});
