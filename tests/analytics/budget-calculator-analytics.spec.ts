import { test, expect } from '../../fixtures/bypassCookies';
import { verifyAnalyticsEvent } from '../../utils/analyticsHelper';


test.describe('Budget Calculator Analytics', () => {
  test.only('should fire analytics events with correct schema and values', async ({ page }) => {
    const analyticsEvents: any[] = [];

    // 1️⃣ Intercept and log Segment analytics requests
    page.on('request', async (req) => {
      if (req.url().includes('https://api.segment.io/v1/t') && req.method() === 'POST') {
        try {
          const data = req.postDataJSON();
          analyticsEvents.push(data);

          // 🔍 Pretty-print event info for debug
          console.log('📊 [Segment Event Captured]');
          console.log(`   Event Name: ${data.event}`);
          console.log(`   Screen: ${data.properties?.screenName}`);
          console.log(`   Element: ${data.properties?.elementName}`);
          console.log(`   Component: ${data.properties?.component}`);
          console.log('──────────────────────────────');
        } catch (err) {
          console.warn('⚠️ Failed to parse Segment event:', err);
        }
      }
    });

    // 2️⃣ Navigate & perform actions

    await page.goto('https://www.earnin.com/financial-calculators');
        await page.waitForTimeout(3000);
    page.pause();
    await page.locator('[data-testid="financial-calculator-Budget calculator-card"]').click();

    await page.fill('input[data-testid="income"', '9000');
    await page.fill('input[data-testid="zipcode"]', '94040');
    await page.getByRole('button', { name: 'Calculate' }).click();

    // 3️⃣ Wait a bit for analytics calls to finish
    await page.waitForTimeout(3000);

    // 🧾 Optional: show full event JSON for deeper debugging
    console.log('✅ All captured Segment events:\n', JSON.stringify(analyticsEvents, null, 2));

    // 4️⃣ Assertions
    const viewedScreen = analyticsEvents.find(
      e => e.event === 'User viewed screen'
    );
    verifyAnalyticsEvent(viewedScreen, {
      'properties.screenName': 'Budget Calculator',
    });

    const interactedIncome = analyticsEvents.find(
      e => e.event === 'User interacted with element' && e.properties.elementName === 'Income'
    );
    verifyAnalyticsEvent(interactedIncome, {
      'properties.component': 'Input Field',
      'properties.elementName': 'Income',
    });

    const interactedZip = analyticsEvents.find(
      e => e.event === 'User interacted with element' && e.properties.elementName === 'Zip Code'
    );
    verifyAnalyticsEvent(interactedZip, {
      'properties.component': 'Input Field',
      'properties.elementName': 'Zip Code',
    });

    const interactedCalculate = analyticsEvents.find(
      e => e.event === 'User interacted with element' && e.properties.elementName === 'Calculate'
    );
    verifyAnalyticsEvent(interactedCalculate, {
      'properties.component': 'CTA',
      'properties.elementName': 'Calculate',
      'properties.screenName': 'Budget Calculator',
    });
  });




  test('verify cookie applied', async ({ page }) => {
  // navigate after fixture has added cookies
  await page.goto('https://www.earnin.com/financial-calculators');

  // debug print cookies visible to this test context
  const cookies = await page.context().cookies('https://www.earnin.com');
  console.log('cookies:', JSON.stringify(cookies, null, 2));

  // check OptanonConsent exists
  const hasOptanon = cookies.some(c => c.name === 'OptanonConsent');
  console.log('OptanonConsent present?', hasOptanon);
  expect(hasOptanon).toBe(true);

  // also check localStorage (from init script)
  const datagrail = await page.evaluate(() => localStorage.getItem('datagrail_consent_preferences'));
  console.log('localStorage.datagrail_consent_preferences =', datagrail);
});
});
