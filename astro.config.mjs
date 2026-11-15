import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  integrations: [react()],
  outDir: './dist/client',
  server: { host: '127.0.0.1', port: 4173 },
  devToolbar: { enabled: false },
});
