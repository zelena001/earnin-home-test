import { test } from '../../fixtures/calculatorFixture';
import { BudgetCalculatorPage } from '../../pages/BudgetCalculatorPage';
import { verifyAnalyticsEvent, captureSegmentEvents } from '../../utils/analyticsHelper';

test.describe('Budget Calculator Analytics', () => {
  test('should capture all relevant analytics events', async ({ page }) => {
    const budgetPage = new BudgetCalculatorPage(page);

    // 1️⃣ Start capturing analytics
    const analyticsEvents = await captureSegmentEvents(page);

    // 2️⃣ Navigate to calculators page
    await budgetPage.goto();

    // 3️⃣ Click Budget Calculator card
    await budgetPage.clickBudgetCalculatorCard();
    await page.waitForTimeout(1000); // wait for analytics

    // 4️⃣ Verify "User viewed screen" event
    const viewedScreenEvent = analyticsEvents.find(
      e => e.event === 'User viewed screen' && e.properties?.screenName === 'Budget Calculator'
    );
    verifyAnalyticsEvent(viewedScreenEvent, {
      'properties.screenName': 'Budget Calculator',
    });

    // 5️⃣ Fill income and verify analytics
    await budgetPage.fillIncome('9000');
    await page.waitForTimeout(1000);

    const interactedIncomeEvent = analyticsEvents.find(
      e => e.event === 'User interacted with element' &&
           e.properties?.elementName === 'Income' &&
           e.properties?.component === 'Input Field'
    );
    verifyAnalyticsEvent(interactedIncomeEvent, {
      'properties.elementName': 'Income',
      'properties.component': 'Input Field',
    });

    // 6️⃣ Fill zipcode and verify analytics
    await budgetPage.fillZipCode('94040');
    await page.waitForTimeout(1000);

    const interactedZipEvent = analyticsEvents.find(
      e => e.event === 'User interacted with element' &&
           e.properties?.elementName === 'Zip Code' &&
           e.properties?.component === 'Input Field'
    );
    verifyAnalyticsEvent(interactedZipEvent, {
      'properties.elementName': 'Zip Code',
      'properties.component': 'Input Field',
    });

    // 7️⃣ Click Calculate and verify analytics
    await budgetPage.clickCalculate();
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

    // 8️⃣ Debug all captured analytics
    console.log('✅ All captured Segment events:\n', JSON.stringify(analyticsEvents, null, 2));
  });
});
