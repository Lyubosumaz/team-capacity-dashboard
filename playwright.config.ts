import { defineConfig, devices } from '@playwright/test';

const BASE_URL = 'http://localhost:3333';

export default defineConfig({
  testDir: './tests/e2e',
  use: {
    baseURL: BASE_URL,
    trace: 'retain-on-failure',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'pnpm dev',
    url: BASE_URL,
    reuseExistingServer: false,
  },
});
