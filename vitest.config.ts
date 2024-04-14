import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path, { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'node',
  },
  resolve: {
    alias: [{ find: "@", replacement: resolve(__dirname, ".") }],
  },
  base: "/",
})
