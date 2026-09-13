import { defineConfig, devices } from '@playwright/test';

const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env['CI'],
  retries: process.env['CI'] ? 2 : 0,
  workers: process.env['CI'] ? 2 : undefined,
  reporter: process.env['CI'] ? [['github'], ['html', { open: 'never' }]] : 'list',
  expect: {
    // Ignore anti-alias jitter across Chrome patch versions.
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },
  use: {
    baseURL: BASE_URL,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // Astro 7's `dev` server unconditionally forks to a background process,
    // which breaks Playwright's webServer contract (Playwright sees the
    // parent exit and gives up with "Process from config.webServer exited
    // early"). Use `build && preview` instead — preview stays foreground,
    // and testing the real build catches adapter/output surprises that dev
    // mode would mask. Cost: ~5-10s extra per run for the build.
    command: 'pnpm build && pnpm preview --port 4321',
    url: BASE_URL,
    reuseExistingServer: !process.env['CI'],
    timeout: 180_000,
    env: {
      // Force fixture mode so tests don't depend on a live Sanity project.
      SANITY_OFFLINE: '1',
      // Explicitly clear Turnstile keys so the contact form skips the
      // anti-spam gate. The .env.example ships the always-challenge test
      // pair for interactive dev, which would otherwise refuse to submit
      // without a solved widget (which Playwright can't drive).
      PUBLIC_TURNSTILE_SITE_KEY: '',
      TURNSTILE_SECRET_KEY: '',
    },
  },
});
