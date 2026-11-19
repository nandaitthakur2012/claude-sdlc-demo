/// <reference types="vitest" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base must match the GitHub Pages path: https://<user>.github.io/claude-sdlc-demo/
export default defineConfig({
  base: '/claude-sdlc-demo/',
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/setupTests.ts',
  },
});
