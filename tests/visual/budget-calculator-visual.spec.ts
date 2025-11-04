import { test, expect } from '../../fixtures/calculatorFixture';

test.describe('Financial Calculator Snapshot Tests', () => {
  
  // This will run on all projects defined in playwright.config.ts (Chrome Desktop, Safari Mobile)
  test('page should match baseline snapshot', async ({ page }) => {
    await page.goto('https://www.earnin.com/financial-calculators');
    await page.waitForTimeout(1500); // optional small delay
    await expect(page).toHaveScreenshot({
      animations: 'disabled',
      //fullPage: true, // optional: capture full page if not use, it won't check scrollable area
    });
  });

});
