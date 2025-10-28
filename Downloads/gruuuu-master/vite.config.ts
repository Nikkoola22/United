import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  // Si on déploie sur GitHub Pages, on garde /gruuuu/
  // Sinon (local ou Vercel), on met "./"
  base: process.env.GITHUB_PAGES ? '/gruuuu/' : './',
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        admin: './admin.html'
      }
    }
  }
});
