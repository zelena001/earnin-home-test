// tests/fixtures/bypassCookies.ts
import { test as base, expect } from '@playwright/test';
import type { BrowserContext } from '@playwright/test';

const PREFERENCES_VALUE = 'dg-category-essential:1|dg-category-functional:1|dg-category-marketing:1|dg-category-performance:1';

export const test = base.extend<{ bypassedCookies: boolean }>({
  // This overrides the built-in page fixture behavior so cookies/localStorage are set
  // before the test's page navigates.
  page: async ({ page, context }, use) => {
    // 1) Add the cookie to the context BEFORE navigation
    await context.addCookies([
      {
        name: 'datagrail_consent_preferences', // or 'preferences' if that's the exact cookie name shown in DevTools
        value: 'dg-category-essential:1|dg-category-functional:1|dg-category-marketing:1|dg-category-performance:1',
        domain: 'www.earnin.com',
        path: '/',
        httpOnly: false,
        secure: true,
        sameSite: 'Strict',
      },
      {
        name: 'datagrail_consent_preferences',
        value: 'dg-category-essential:1|dg-category-functional:1|dg-category-marketing:1|dg-category-performance:1',
        domain: '.earnin.com',
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
      }
    ]);

    // 2) Defensive: set localStorage before any page script runs (so checks that read localStorage pass)
    (context as BrowserContext).addInitScript(() => {
      try {
        localStorage.setItem('datagrail_consent_preferences', 'dg-category-essential:1|dg-category-functional:1|dg-category-marketing:1|dg-category-performance:1');
      } catch (e) { /* ignore cross-origin issues */ }
    });

    // 3) Another defensive init script to remove banner DOM immediately if it still tries to show
    (context as BrowserContext).addInitScript(() => {
      const removeBanner = () => {
        const selectors = [
          '#onetrust-consent-sdk',
          '.onetrust-banner-wrapper',
          '.ot-sdk-container',
          '.cookie-consent',
          '[data-testid="cookie-banner"]'
        ];
        for (const s of selectors) {
          const el = document.querySelector(s);
          if (el) el.remove();
        }
        // hide overlays that often block clicks
        const overlays = document.querySelectorAll('[class*="cookie"], [id*="onetrust"]');
        overlays.forEach(e => (e as HTMLElement).style.display = 'none');
      };
      removeBanner();
      document.addEventListener('DOMContentLoaded', removeBanner);
      window.addEventListener('load', removeBanner);
    });

    // 4) Now proceed with the normal page for the test
    await use(page);
  },
});

export { expect };
