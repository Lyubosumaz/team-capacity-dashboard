import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3000';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: BASE_URL,
    // Saves a step-by-step trace when a test fails.
    // Open it with: pnpm exec playwright show-trace <file>
    trace: 'retain-on-failure',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  // Playwright starts the dev server before the tests and stops it after.
  // Locally it reuses a dev server that is already running.
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
  },
});
