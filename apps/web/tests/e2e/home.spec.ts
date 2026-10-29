import { expect, test } from '@playwright/test';
import { logIn } from './logIn';

test.describe('Dashboard flows', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
  });

  test('shows teams over capacity widget', async ({ page }) => {
    await page.goto('/overview');

    await expect(
      page.getByRole('heading', { level: 2, name: /teams over capacity/i }),
    ).toBeVisible();
  });
});
