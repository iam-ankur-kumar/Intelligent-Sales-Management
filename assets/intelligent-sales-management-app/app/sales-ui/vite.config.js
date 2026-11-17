import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': { target: 'http://localhost:4004', changeOrigin: true },
      '/odata': { target: 'http://localhost:4004', changeOrigin: true }
    }
  },
  build: {
    outDir: '../../public/sales-ui',
    emptyOutDir: true
  }
});
