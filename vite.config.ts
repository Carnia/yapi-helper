import { defineConfig } from 'vite'
import path from 'path';
import vue from '@vitejs/plugin-vue'
import { crx } from '@crxjs/vite-plugin'
import { NodeGlobalsPolyfillPlugin } from '@esbuild-plugins/node-globals-polyfill';
import manifest from './manifest'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    crx({
      manifest
    })
  ],
  resolve: {
    alias: {
      // 添加path的别名
      path: 'path-browserify',
      url: 'url-polyfill',
      '@': path.resolve('./src')
    }
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis'
      },
      // Enable esbuild polyfill plugins
      plugins: [
        NodeGlobalsPolyfillPlugin({
          process: true,
          buffer: true,
        })
      ]
    }
  },
})
