import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
      '@ic': path.resolve(__dirname, './src/assets/images/icon'),
    },
  },
  plugins: [
    react(),
    svgr({
      svgrOptions: {
        svgoConfig: { plugins: [{ removeViewBox: false }] },
      },
    }),
  ],
});
