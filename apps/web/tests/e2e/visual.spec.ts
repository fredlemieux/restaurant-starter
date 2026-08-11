import { test, expect } from '@playwright/test';

/**
 * Visual regression tests — the safety net that would have caught the
 * "hero doesn't render / nav invisible" class of bug that pure behaviour
 * tests slipped past. Every route gets a full-page screenshot compared
 * against a committed baseline.
 *
 * Baselines live in `apps/web/tests/e2e/visual.spec.ts-snapshots/`.
 * Regenerate after intentional visual changes:
 *
 *   pnpm --filter @restaurant/web exec playwright test visual.spec.ts \
 *     --update-snapshots
 */

const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/menus', name: 'menus' },
  { path: '/menus/tapas', name: 'menu-tapas' },
  { path: '/menus/menu-del-dia', name: 'menu-del-dia' },
  { path: '/story', name: 'story' },
  { path: '/press', name: 'press' },
  { path: '/private-hire', name: 'private-hire' },
  { path: '/contact', name: 'contact' },
];

test.describe('visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 });
  });

  for (const route of ROUTES) {
    test(route.name, async ({ page }) => {
      await page.goto(route.path, { waitUntil: 'networkidle' });

      // Fonts must be ready before snapshot or Cormorant Garamond will
      // fall back to Georgia mid-capture on some runs.
      await page.evaluate(() => document.fonts.ready);

      // Ensure hero image (if present) has finished loading.
      await page.waitForFunction(() => {
        const img = document.querySelector('main section:first-child img');
        return !img || (img as HTMLImageElement).complete;
      });

      await expect(page).toHaveScreenshot(`${route.name}.png`, {
        fullPage: true,
        // OpenTable widget mounts a third-party iframe whose contents drift
        // between runs — mask it so diffs stay stable.
        mask: [page.locator('[data-testid="opentable-embed"]')],
        // Small tolerance for anti-alias jitter across Chrome patch versions.
        maxDiffPixelRatio: 0.02,
      });
    });
  }
});
