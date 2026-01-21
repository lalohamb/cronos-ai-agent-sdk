import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    commonjsOptions: {
      include: [/@sentinal\/ai-agent-sdk/, /node_modules/],
      transformMixedEsModules: true,
    },
  },
});
