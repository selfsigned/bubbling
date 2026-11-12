import { defineConfig } from 'astro/config';
import svelte from '@astrojs/svelte';

import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: process.env.PAGES_SITE,
  base: process.env.PAGES_BASE || '/',
  trailingSlash: 'always',
  integrations: [svelte()],

  vite: {
    plugins: [tailwindcss()],
  },
});