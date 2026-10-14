import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Preview deploys under a subpath on GitHub Pages (/aajiva-preview/).
  // Set VITE_BASE_PATH=/aajiva-preview/ for those builds; default '/'.
  base: process.env.VITE_BASE_PATH || '/',
  server: { host: '0.0.0.0', port: 5200 },
});
