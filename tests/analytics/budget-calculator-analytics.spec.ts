import { test, expect } from '../../fixtures/bypassCookies';
import { verifyAnalyticsEvent } from '../../utils/analyticsHelper';

test.describe('Budget Calculator Analytics', () => {
     test.only('should capture "User viewed screen" event after clicking Budget Calculator', async ({ page }) => {
    // 1️⃣ Navigate to the calculators page
    await page.goto('https://www.earnin.com/financial-calculators');

    // 2️⃣ Click the Budget Calculator card
    await page.locator('div[data-testid^="financial-calculator-"]:has-text("Budget calculator")').click();

    // 3️⃣ Wait for the "User viewed screen" analytics event
    const viewedScreenRequest = await page.waitForRequest(req => {
      if (req.url().includes('https://api.segment.io/v1/t') && req.method() === 'POST') {
        try {
          const data = req.postDataJSON();
          return data.event === 'User viewed screen' &&
                 data.properties?.screenName === 'Budget Calculator';
        } catch {
          return false;
        }
      }
      return false;
    }, { timeout: 5000 });

    // 4️⃣ Get payload and debug
    const viewedScreenPayload = viewedScreenRequest.postDataJSON();
    console.log('📊 User viewed screen event payload:\n', JSON.stringify(viewedScreenPayload, null, 2));

    // 5️⃣ Verify the event properties
    verifyAnalyticsEvent(viewedScreenPayload, {
      'properties.screenName': 'Budget Calculator',
    });

     // Fill income
    // Fill income
await page.fill('input[data-testid="income"]', '9000');

// Wait for the "User interacted with element" event for Income
const interactedIncomeRequest = await page.waitForRequest(req => {
  if (req.url().includes('https://api.segment.io/v1/t') && req.method() === 'POST') {
    try {
      const data = req.postDataJSON();
      return data.event === 'User interacted with element' &&
             data.properties?.elementName === 'Income' &&
             data.properties?.component === 'Input Field';
    } catch {
      return false;
    }
  }
  return false;
}, { timeout: 5000 });

// Get payload and debug
const interactedIncomePayload = interactedIncomeRequest.postDataJSON();
console.log('📊 User interacted with element - Income event payload:\n', JSON.stringify(interactedIncomePayload, null, 2));

// Verify the event properties
verifyAnalyticsEvent(interactedIncomePayload, {
  'properties.elementName': 'Income',
  'properties.component': 'Input Field',
});




  });
//   test.only('should fire analytics events with correct schema and values', async ({ page }) => {
//     const analyticsEvents: any[] = [];

//     // 1️⃣ Intercept and log Segment analytics requests
//     page.on('request', async (req) => {
//       if (req.url().includes('https://api.segment.io/v1/t') && req.method() === 'POST') {
//         try {
//           const data = req.postDataJSON();
//           analyticsEvents.push(data);

//           // Pretty-print event info for debug
//           console.log('📊 [Segment Event Captured]');
//           console.log(`   Event Name: ${data.event}`);
//           console.log(`   Screen: ${data.properties?.screenName}`);
//           console.log(`   Element: ${data.properties?.elementName}`);
//           console.log(`   Component: ${data.properties?.component}`);
//           console.log('──────────────────────────────');
//         } catch (err) {
//           console.warn('⚠️ Failed to parse Segment event:', err);
//         }
//       }
//     });

//     // 2️⃣ Navigate & perform actions
//     await page.goto('https://www.earnin.com/financial-calculators');
//     await page.waitForTimeout(2000);

//     // Click the Budget calculator card
//     await page.locator('div[data-testid^="financial-calculator-"]:has-text("Budget calculator")').click();

//     // Pause for debug after card click
//     await page.pause();

//     // Fill income
//     await page.fill('input[data-testid="income"]', '9000');
//     await page.pause(); // Pause here for debug

//     // Fill zip code
//     await page.fill('input[data-testid="zipcode"]', '94040');

//     // Click Calculate
//     await page.getByRole('button', { name: 'Calculate' }).click();

//     // Wait for analytics calls to finish
//     await page.waitForTimeout(3000);

//     // 🧾 Debug: show all captured Segment events
//     console.log('✅ All captured Segment events:\n', JSON.stringify(analyticsEvents, null, 2));

//     // 3️⃣ Assertions using nested property validation
//     const viewedScreen = analyticsEvents.find(e => e.event === 'User viewed screen');
//     verifyAnalyticsEvent(viewedScreen, {
//       'properties.screenName': 'Budget Calculator',
//     });

//     const interactedIncome = analyticsEvents.find(
//       e => e.event === 'User interacted with element' && e.properties.elementName === 'Income'
//     );
//     verifyAnalyticsEvent(interactedIncome, {
//       'properties.elementName': 'Income',
//       'properties.component': 'Input Field',
//     });

//     const interactedZip = analyticsEvents.find(
//       e => e.event === 'User interacted with element' && e.properties.elementName === 'Zip Code'
//     );
//     verifyAnalyticsEvent(interactedZip, {
//       'properties.elementName': 'Zip Code',
//       'properties.component': 'Input Field',
//     });

//     const interactedCalculate = analyticsEvents.find(
//       e => e.event === 'User interacted with element' && e.properties.elementName === 'Calculate'
//     );
//     verifyAnalyticsEvent(interactedCalculate, {
//       'properties.elementName': 'Calculate',
//       'properties.component': 'CTA',
//       'properties.screenName': 'Budget Calculator',
//     });
//   });
});