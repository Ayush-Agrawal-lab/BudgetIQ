import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';
import react from '@vitejs/plugin-react-swc';

export default defineConfig({
  plugins: [react()],
  base: '/BudgetIQ/',  // Add base URL for GitHub Pages
  server: {
    port: 3000,
    host: true,
    strictPort: false, // Allow Vite to use another port if 3000 is taken
    // Needed for Codespaces
    hmr: {
      clientPort: 443
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});