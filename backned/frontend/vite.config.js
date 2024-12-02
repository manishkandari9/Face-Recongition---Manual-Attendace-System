import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000, // specify the port for the development server
    open: true,  // automatically open the browser on server start
  },
});
