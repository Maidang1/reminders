import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

// @ts-expect-error process is a nodejs global
const host = process.env.TAURI_DEV_HOST;

export default defineConfig({
  plugins: [pluginReact()],
  html: {
    template: './index.html',
  },
  source: {
    entry: {
      index: "./src/main.tsx"
    }
  },
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
  },
  dev: {
    hmr: true,
    watchFiles: [{
      paths: ['src/**/*.{ts,tsx,js,jsx,html,css,sass,scss}'],
    }],
  },
  tools: {
    postcss: (opts, { addPlugins }) => {
      // @ts-ignore
      addPlugins(require("@tailwindcss/postcss"))
    }
  }

});