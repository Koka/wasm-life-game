import wasm from "vite-plugin-wasm"
import topLevelAwait from "vite-plugin-top-level-await"
import watchAndRun from 'vite-plugin-watch-and-run'
import path from "path"

import { defineConfig } from "vite"

export default defineConfig({
  resolve: {
    alias: {
      wasm: path.resolve(__dirname, './wasm'),
    },
  },
  plugins: [
    wasm(),
    topLevelAwait(),
    watchAndRun([
      {
        name: 'wasm-pack',
        watchKind: ['add', 'change', 'unlink'],
        watch: path.resolve('wasm/**/*.(rs|toml)'),
        run: 'yarn wasm',
        delay: 300,
      },
    ]),
  ],
})
