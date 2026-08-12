import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import cloudflare from '@astrojs/cloudflare';
import tailwindcss from '@tailwindcss/vite';

const site = process.env.PUBLIC_SITE_URL ?? 'http://localhost:4321';

// The Cloudflare adapter runs the dev server inside miniflare (a workerd
// runtime with no Node globals), which crashes Astro's JSON logger on
// `process.stderr.write`. We only need the adapter for `astro build` +
// `astro preview`, so skip it during `astro dev` unless USE_CLOUDFLARE_DEV=1
// is set to opt into miniflare parity locally.
// Check argv[2] exactly (the subcommand slot) — `argv.includes('dev')` would
// also match `astro build --devtools` or any flag literal containing "dev".
const isDev = process.argv[2] === 'dev';
const useAdapter = !isDev || process.env.USE_CLOUDFLARE_DEV === '1';

export default defineConfig({
  site,
  output: 'static',
  ...(useAdapter ? { adapter: cloudflare({ imageService: 'compile' }) } : {}),
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
    ssr: {
      external: ['@resvg/resvg-js'],
    },
  },
});
