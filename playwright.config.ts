import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: [['allure-playwright'], ['html']],
  /* Global teardown to clean empty video directories */
  globalTeardown: require.resolve('./utils/global-teardown.ts'),
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: 'https://www.automationexercise.com',

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',

    /* Take screenshot only when test fails */
    screenshot: {
      mode: 'only-on-failure',
      fullPage: false // Use viewport screenshots to avoid size limits
    },

    /* Video recording configuration - supports optional full recording */
    video: {
      mode: process.env.VIDEO_MODE === 'all' ? 'on' :
        process.env.VIDEO_MODE === 'off' ? 'off' :
          'retain-on-failure',
      size: { width: 1280, height: 720 }
    },

    /* Ignore HTTPS errors and mixed content warnings */
    ignoreHTTPSErrors: true,

    /* Timeout configurations */
    actionTimeout: 15000, // 15 seconds for individual actions (click, fill, etc.)
    navigationTimeout: 30000, // 30 seconds for page navigation
  },

  /* Global test timeout - maximum time for a single test */
  timeout: 60000, // 60 seconds per test

  /* Global expect timeout for assertions */
  expect: {
    timeout: 10000 // 10 seconds for expect assertions
  },

  /* Configure output directories */
  outputDir: 'Evidence/video',

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    /* Test against mobile viewports. */
    // {
    //   name: 'Mobile Chrome',
    //   use: { ...devices['Pixel 5'] },
    // },
    // {
    //   name: 'Mobile Safari',
    //   use: { ...devices['iPhone 12'] },
    // },

    /* Test against branded browsers. */
    {
      name: 'Microsoft Edge',
      use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },],
});
