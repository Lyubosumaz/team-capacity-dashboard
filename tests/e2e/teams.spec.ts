import { expect, test } from '@playwright/test';
import { logIn } from './logIn';

test.describe('Teams pages', () => {
  test.beforeEach(async ({ page }) => {
    await logIn(page);
  });

  test('shows the teams page from the menu', async ({ page }) => {
    await page.goto('/overview');
    await page
      .getByRole('navigation', { name: 'Primary navigation' })
      .getByRole('link', { name: 'Teams' })
      .click();

    await expect(page).toHaveURL(/\/teams$/);
    await expect(page.getByRole('button', { name: 'Add team' })).toBeVisible();
  });

  test('creates a team, adds a member and deletes the team', async ({
    page,
    browserName,
  }) => {
    // A unique name, because the browsers run these tests at the same time.
    const teamName = `E2E ${browserName} ${Date.now()}`;
    const email = process.env.E2E_EMAIL ?? '';

    await page.goto('/teams');
    await page.getByRole('button', { name: 'Add team' }).click();
    await page.getByLabel('Team name').fill(teamName);
    await page.getByRole('button', { name: 'Add', exact: true }).click();

    await page.getByRole('link', { name: new RegExp(teamName) }).click();
    await expect(
      page.getByRole('heading', { level: 1, name: teamName }),
    ).toBeVisible();

    // The test user's own account is in the list after logging in.
    await page.getByLabel('Account').selectOption({ label: email });
    await page.getByLabel('Role', { exact: true }).fill('Designer');
    await page.getByLabel('Capacity per sprint').fill('8');
    await page.getByRole('button', { name: 'Add member' }).click();
    await expect(page.getByRole('rowheader', { name: email })).toBeVisible();

    await page.goto('/teams');
    await page.getByRole('button', { name: `Delete ${teamName}` }).click();
    await page.getByRole('button', { name: 'Delete', exact: true }).click();
    await expect(
      page.getByRole('link', { name: new RegExp(teamName) }),
    ).toHaveCount(0);
  });
});
