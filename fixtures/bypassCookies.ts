
// tests/fixtures/bypassCookies.ts
import { test as base, expect } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';

export const test = base.extend<{ bypassedCookies: boolean }>({
  bypassedCookies: [
    async ({ browser }, use) => {
      // 1️⃣ Create a fresh context
      const context = await browser.newContext();

      // 2️⃣ Add cookies BEFORE creating a page
      await context.addCookies([
        {
          name: 'OptanonConsent',
          value: 'isGpcEnabled=0&datestamp=Fri+Oct+31+2025+21%3A29%3A49+GMT%2B0700&version=202409.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=aa3bb218-dab3-462b-97d8-09f8ce80078a&interactionCount=0&isAnonUser=1&landingPath=https%3A%2F%2Fwww.earnin.com%2Ffinancial-tools%2Fbudget-calculator&groups=C0001%3A1%2CC0003%3A1%2CBG18%3A0%2CC0002%3A0%2CC0004%3A0',
          domain: 'www.earnin.com',
          path: '/',
          httpOnly: false,
          secure: true,
          sameSite: 'Lax',
        },
        {
          name: 'OptanonConsent',
          value: 'isGpcEnabled=0&datestamp=Fri+Oct+31+2025+21%3A29%3A49+GMT%2B0700&version=202409.1.0&browserGpcFlag=0&isIABGlobal=false&hosts=&consentId=aa3bb218-dab3-462b-97d8-09f8ce80078a&interactionCount=0&isAnonUser=1&landingPath=https%3A%2F%2Fwww.earnin.com%2Ffinancial-tools%2Fbudget-calculator&groups=C0001%3A1%2CC0003%3A1%2CBG18%3A0%2CC0002%3A0%2CC0004%3A0',
          domain: '.earnin.com',
          path: '/',
          httpOnly: false,
          secure: true,
          sameSite: 'Lax',
        },
        {
          name: 'datagrail_consent_preferences',
          value: 'dg-category-essential:1|dg-category-functional:1|dg-category-marketing:1|dg-category-performance:1',
          domain: 'www.earnin.com',
          path: '/',
          httpOnly: false,
          secure: false,
          sameSite: 'Strict',
        },
      ]);

      // 3️⃣ Defensive localStorage for good measure
      context.addInitScript(() => {
        localStorage.setItem(
          'datagrail_consent_preferences',
          'dg-category-essential:1|dg-category-functional:1|dg-category-marketing:1|dg-category-performance:1'
        );
      });

      // 4️⃣ Create a page in this context
      const page = await context.newPage();

      // 5️⃣ Give test access
      await use(true);
    },
    { scope: 'test' },
  ],
});

export { expect };
