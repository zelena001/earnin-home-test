import { test } from '../../fixtures/bypassCookies';
import { verifyAnalyticsEvent } from '../../utils/analyticsHelper';

test.describe('Budget Calculator Analytics', () => {
  test.only('should capture all relevant analytics events', async ({ page }) => {
    // Array to store all captured Segment events
    const analyticsEvents: any[] = [];

    // 1️⃣ Intercept all Segment requests and store payloads
    page.on('request', async (req) => {
      if (req.url().includes('https://api.segment.io/v1/t') && req.method() === 'POST') {
        try {
          const data = req.postDataJSON();
          analyticsEvents.push(data);
          console.log('📊 [Segment Event Captured] Event:', data.event);
        } catch (err) {
          console.warn('⚠️ Failed to parse Segment request', err);
        }
      }
    });

    // 2️⃣ Navigate to calculators page
    await page.goto('https://www.earnin.com/financial-calculators');

    // 3️⃣ Click the Budget Calculator card
    await page.locator('div[data-testid^="financial-calculator-"]:has-text("Budget calculator")').click();

    // Give Segment some time to send events
    await page.waitForTimeout(1000);

    // 4️⃣ Verify "User viewed screen" event
    const viewedScreenEvent = analyticsEvents.find(
      e => e.event === 'User viewed screen' && e.properties?.screenName === 'Budget Calculator'
    );
    verifyAnalyticsEvent(viewedScreenEvent, {
      'properties.screenName': 'Budget Calculator',
    });

    // 5️⃣ Fill income field
    await page.fill('input[data-testid="income"]', '9000');

    // Wait for analytics
    await page.waitForTimeout(500);

    const interactedIncomeEvent = analyticsEvents.find(
      e => e.event === 'User interacted with element' &&
           e.properties?.elementName === 'Income' &&
           e.properties?.component === 'Input Field'
    );
    verifyAnalyticsEvent(interactedIncomeEvent, {
      'properties.elementName': 'Income',
      'properties.component': 'Input Field',
    });

    // 6️⃣ Fill zipcode field
    await page.fill('input[data-testid="zipcode"]', '94040');

    await page.waitForTimeout(500);

    const interactedZipEvent = analyticsEvents.find(
      e => e.event === 'User interacted with element' &&
           e.properties?.elementName === 'Zip Code' &&
           e.properties?.component === 'Input Field'
    );
    verifyAnalyticsEvent(interactedZipEvent, {
      'properties.elementName': 'Zip Code',
      'properties.component': 'Input Field',
    });

    // 7️⃣ Click Calculate button
    await page.getByRole('button', { name: 'Calculate' }).click();

    await page.waitForTimeout(1000);

    const interactedCalculateEvent = analyticsEvents.find(
      e => e.event === 'User interacted with element' &&
           e.properties?.elementName === 'Calculate' &&
           e.properties?.component === 'CTA'
    );
    verifyAnalyticsEvent(interactedCalculateEvent, {
      'properties.elementName': 'Calculate',
      'properties.component': 'CTA',
      'properties.screenName': 'Budget Calculator',
    });

    // 8️⃣ Debug: print all captured analytics
    console.log('✅ All captured Segment events:\n', JSON.stringify(analyticsEvents, null, 2));
  });
});
