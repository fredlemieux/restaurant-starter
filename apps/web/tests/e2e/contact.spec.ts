import { test, expect } from '@playwright/test';

test('contact form submits and shows success state', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true }) }),
  );

  await page.goto('/contact');
  await page.getByLabel(/your name/i).fill('Ada');
  await page.getByLabel(/email/i).fill('ada@example.com');
  await page.getByLabel(/message/i).fill('Table for two, anniversary.');
  await page.getByRole('button', { name: /send/i }).click();

  await expect(page.getByRole('status')).toContainText(/be in touch/i);
});
