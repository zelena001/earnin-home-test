// playwright.config.ts
import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,

  expect: {
    // ✅ Snapshot/visual testing tolerances
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
  },

  // ✅ Global context for all tests
  use: {
    screenshot: 'only-on-failure', // Take screenshot automatically on failure
    trace: 'retain-on-failure',    // Keep trace on failure for debugging
    video: 'retain-on-failure',    // Keep video on failure
  },

  projects: [
    {
      name: "Chrome Desktop",
      use: {
        browserName: "chromium",
        viewport: { width: 1726, height: 1271 },
        deviceScaleFactor: 1,
      },
    },
    {
      name: "Safari Mobile",
      use: {
        browserName: "webkit",
        viewport: { width: 390, height: 844 },
        isMobile: true,
        deviceScaleFactor: 3,
      },
    },
  ],
});
