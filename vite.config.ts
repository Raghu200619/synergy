import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  
  server: {
    host: '0.0.0.0', // Allow external connections
    port: 5173,      // Default port
    strictPort: true, // Don't try other ports if 5173 is busy
  },
});
