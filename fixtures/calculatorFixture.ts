
import { test as base, expect, BrowserContext } from '@playwright/test';
import { BudgetCalculatorPage } from '../pages/BudgetCalculatorPage'; // adjust path

export const test = base.extend<{ calculator: BudgetCalculatorPage }>({
  // --- Override `page` first so cookies and localStorage are handled ---
  page: async ({ page, context }, use) => {
    // 1) Add cookies before navigation
    // The reason we need these cookies is to bypass cookie consent banners, otherwise it will block the screen
    await context.addCookies([
      {
        name: 'datagrail_consent_preferences',
        value: 'dg-category-essential:1|dg-category-functional:1|dg-category-marketing:1|dg-category-performance:1',
        domain: 'www.earnin.com',
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'Strict',
      },
      {
        name: 'OptanonConsent',
        value: 'isGpcEnabled=0&datestamp=Fri+Oct+31+2025+22%3A19%3A30+GMT%2B0700+(Indochina+Time)&version=202409.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=2cc77bae-3299-4f18-8ee4-99130863dfaa&interactionCount=0&isAnonUser=1&landingPath=https%3A%2F%2Fwww.earnin.com%2Ffinancial-tools%2Fbudget-calculator&groups=C0001%3A1%2CC0003%3A1%2CBG18%3A0%2CC0002%3A0%2CC0004%3A0',
        domain: '.earnin.com',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
      {
        name: 'OptanonAlertBoxClosed',
        value: '2025-10-31T15:21:25.167Z',
        domain: '.earnin.com',
        path: '/',
        httpOnly: false,
        secure: false,
        sameSite: 'Lax',
      },
    ]);

    await use(page);
  },

  //  POM Feature
  calculator: async ({ page }, use) => {
    const calculator = new BudgetCalculatorPage(page);
    await calculator.goto();
    await use(calculator);
  },
});

export { expect };
