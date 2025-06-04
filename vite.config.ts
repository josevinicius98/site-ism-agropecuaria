// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Qualquer chamada a /api/* será redirecionada para o backend em localhost:3001
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,  // ajusta o header Host para corresponder ao target
        secure: false,       // permite proxy para servidores HTTPS locais sem certificado válido
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // evita otimização ESM para lucide-react
  },
});