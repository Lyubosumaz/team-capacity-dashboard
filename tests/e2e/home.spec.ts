import { expect, test } from '@playwright/test';

test.describe('Dashboard flows', () => {
  test('can view team list and team detail', async ({ page }) => {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Teams' })
      .click();
    await expect(page).toHaveURL(/\/teams$/);

    await page.locator("a[href^='/teams/']").first().click();

    await expect(
      page.getByRole('heading', { level: 2, name: /members & capacity/i }),
    ).toBeVisible();
  });

  test('shows teams over capacity widget', async ({ page }) => {
    await page.goto('/');

    await expect(
      page.getByRole('heading', { level: 2, name: /teams over capacity/i }),
    ).toBeVisible();
  });
});
