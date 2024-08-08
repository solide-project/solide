import path, { resolve } from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "node",
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, ".") }],
  },
  base: "/",
})
