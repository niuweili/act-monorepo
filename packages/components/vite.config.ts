import { resolve } from 'path'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue';
import commonjs from 'vite-plugin-commonjs'
import Components from 'unplugin-vue-components/vite';
import { VantResolver } from '@vant/auto-import-resolver';
import dts from 'vite-plugin-dts'

// const PKG_JSON = require(join(__dirname, 'package.json'));

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'index',
      // the proper extensions will be added
      fileName: 'index',
      formats: ['cjs', 'es']
    },
    rollupOptions: {
      input: './src/index.ts',
      // 确保外部化处理那些你不想打包进库的依赖
      // output: {
      //   // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      //   globals: {
      //     vue: 'Vue',
      //   },
      // },
    }
  },
  plugins: [
    dts({ rollupTypes: true, outDir: './dist' }),
    vue(),
    Components({
      resolvers: [VantResolver()],
    }),
    commonjs()
  ],
})
