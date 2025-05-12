// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Qualquer chamada a /api/* será redirecionada a http://localhost:3001/api/*
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,  // ajusta o header Host
        secure: false,       // se estiver usando HTTPS local
      },
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // mantém o pacote fora da otimização ESM
  },
});
