import { test, expect } from '@playwright/test';

test('homepage renders the restaurant name and a reservation CTA', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  await expect(page.getByRole('link', { name: /reserve a table/i })).toBeVisible();
});

test('primary nav links are present and reachable', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: /primary/i })).toBeVisible();
  for (const label of ['Menus', 'Story', 'Press', 'Private hire', 'Contact']) {
    await expect(page.getByRole('link', { name: label })).toBeVisible();
  }
});
