import { defineConfig, devices } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30_000,
  expect: {
    // allow some tolerance in snapshots
    toHaveScreenshot: { maxDiffPixelRatio: 0.02 },
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
