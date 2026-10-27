import { expect, test } from '@playwright/test';

test.describe('Teams pages', () => {
  test('shows teams list', async ({ page }) => {
    await page.goto('/teams');

    await expect(page.locator("a[href^='/teams/']").first()).toBeVisible();
  });

  test('shows team detail with members, projects and charts', async ({
    page,
  }) => {
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
    await expect(
      page.getByRole('heading', { level: 2, name: /projects & risks/i }),
    ).toBeVisible();
    await expect(
      page.getByRole('heading', { level: 2, name: /capacity & workload/i }),
    ).toBeVisible();
  });
});
