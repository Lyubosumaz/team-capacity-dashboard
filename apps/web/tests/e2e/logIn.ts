import { expect, type Page } from '@playwright/test';

// The dashboard needs a login. Logs in as the test user from local.env.
export const logIn = async (page: Page) => {
  const email = process.env.E2E_EMAIL;
  const password = process.env.E2E_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'Add E2E_EMAIL and E2E_PASSWORD (a test user) to local.env.',
    );
  }

  await page.goto('/login');
  await page.getByLabel('Work email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Log in' }).click();
  await expect(page).toHaveURL(/\/overview$/);
};
