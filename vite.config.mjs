import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import browserslistToEsbuild from 'browserslist-to-esbuild';

export default defineConfig({
  plugins: [react()],
  build: { outDir: 'build', target: browserslistToEsbuild() },
  server: {
    port: 3000,
    strictPort: true,
    proxy: { '/api': 'http://localhost:3001' },
  },
});
