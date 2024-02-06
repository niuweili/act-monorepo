import { join } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import commonjs from 'vite-plugin-commonjs'
const PKG_JSON = require(join(__dirname, 'package.json'));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: './src/main.ts',
      output: [
        {
          format: 'es',
          name: PKG_JSON.name,
          dir: 'dist/esm',
          preserveModules: true,
          globals: {
            vue: 'vue',
          },
        },
        {
          file: 'dist/cjs/index.js',
          format: 'cjs',
          name: PKG_JSON.name,
          globals: {
            vue: 'vue',
          },
        },
      ],
    }
  },
  plugins: [
    vue(),
    commonjs()
  ],
})
