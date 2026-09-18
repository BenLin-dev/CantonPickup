import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        // Vendor splitting only makes sense for the browser bundle. During the
        // prerender pass Vue is external, so Rollup rejects manualChunks.
        ...(isSsrBuild
          ? {}
          : {
              manualChunks: {
                vue: ['vue', 'vue-router'],
              },
            }),
      },
    },
  },
  server: {
    port: 5173,
    host: true,
  },
}))
