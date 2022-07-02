import vueJsx from "@vitejs/plugin-vue-jsx";

import path from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [vueJsx()],
    resolve: {
        alias: {
            $components: path.resolve("./docs/.vitepress/components"),
        },
    },
});
