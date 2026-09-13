import { test, expect } from '@playwright/test';

test('contact form submits and shows success state', async ({ page }) => {
  await page.route('**/api/contact', (route) =>
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ ok: true }),
    }),
  );

  await page.goto('/contact');
  const nameInput = page.getByLabel(/your name/i);
  const emailInput = page.getByLabel(/email/i);
  const messageInput = page.getByLabel(/message/i);

  await nameInput.fill('Ada');
  await emailInput.fill('ada@example.com');
  await messageInput.fill('Table for two, anniversary.');

  // Sanity-check the fills stuck before submitting — surfaces state-sync races
  // between Playwright and React controlled inputs cleanly.
  await expect(nameInput).toHaveValue('Ada');
  await expect(emailInput).toHaveValue('ada@example.com');
  await expect(messageInput).toHaveValue('Table for two, anniversary.');

  await page.getByRole('button', { name: /send/i }).click();

  await expect(page.getByRole('status')).toContainText(/be in touch/i);
});
