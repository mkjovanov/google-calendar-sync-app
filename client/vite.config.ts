import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/auth': 'http://localhost:4000',
      '/current-user': 'http://localhost:4000',
      '/calendar/events': 'http://localhost:4000',
      '/calendar/local-events': 'http://localhost:4000',
    }
  }
});
