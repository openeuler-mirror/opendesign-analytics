import { resolve } from 'path';
import { defineConfig } from 'vite';
import dts from 'vite-plugin-dts';

export default defineConfig({
  base: './',
  build: {
    target: ['chrome74'],
    lib: {
      entry: resolve(__dirname, './src/index.ts'),
      name: 'OpenAnalytics',
      fileName: 'open-analytics',
      formats: ['es'],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
    }),
  ],
  resolve: {
    alias: {
      '@/': `${resolve(__dirname, './src')}/`,
    },
  },
  server: {
    port: 3300,
  },
});
