import { expect, test } from '@playwright/test';

test('loads the renderer app shell', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: /hello world guy/i })).toBeVisible();
  await expect(page.getByText(/tauri \+ react \+ plotly starter app/i)).toBeVisible();
  await expect(page.locator('.plot-container').first()).toBeVisible();
});
