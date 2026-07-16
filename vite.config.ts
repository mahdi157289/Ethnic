import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

const port = process.env.PORT ? Number(process.env.PORT) : 3000;

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    host: true,
    port,
  },
  preview: {
    host: true,
    port,
  },
});
