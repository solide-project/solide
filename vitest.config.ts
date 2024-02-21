import { fileURLToPath, URL } from "node:url";

import { defineConfig } from "vite";
import { resolve, dirname } from "node:path";

export default defineConfig({
    plugins: [
    ],
    resolve: {
        alias: [{ find: "@", replacement: resolve(__dirname, ".") }]
    },
    base: "/"
});