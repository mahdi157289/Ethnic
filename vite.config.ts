import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

export default defineConfig({
  base: '/',
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port,
    allowedHosts: ['ethnic-s2m2.onrender.com', 'localhost', '127.0.0.1'],
  },
  preview: {
    host: true,
    port,
    allowedHosts: ['ethnic-s2m2.onrender.com', 'localhost', '127.0.0.1'],
  },
});
