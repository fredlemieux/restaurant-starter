import { test, expect } from '@playwright/test';

test('homepage renders the restaurant name and a reservation CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  // Multiple reserve/reservation links exist across nav + hero + CTA section —
  // .first() is fine here; we just need at least one to be present.
  await expect(page.getByRole('link', { name: /reserve a table/i }).first()).toBeVisible();
});

test('primary nav links are present and reachable', async ({ page }) => {
  await page.goto('/');
  const nav = page.getByRole('navigation', { name: /primary/i });
  await expect(nav).toBeVisible();
  for (const label of ['Menus', 'Story', 'Press', 'Private hire', 'Contact']) {
    // Scope to nav to avoid matching duplicate in-page links (e.g. "See all menus").
    await expect(nav.getByRole('link', { name: label, exact: true })).toBeVisible();
  }
});
