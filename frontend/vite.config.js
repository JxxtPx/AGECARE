import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 this is what allows phone access
    port: 5173, // optional: force port to match your current setup
  },
});
