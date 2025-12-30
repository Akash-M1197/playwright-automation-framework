// @ts-check
import { chromium, defineConfig, devices } from '@playwright/test';


/**
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  timeout:40000,
  reporter : 'html',
  use: {
    browserName : 'chromium',
    headless : false,
    screenshot : 'on',
    trace : 'on',
    ignoreHTTPSErrors: true,
    video:'on',
    
  }
});

