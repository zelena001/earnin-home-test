import { test } from '../../fixtures/calculatorFixture';
import { verifyAnalyticsEvent, captureSegmentEvents } from '../../helpers/analyticsHelper';

test.describe('Budget Calculator Analytics', () => {
  test('should capture all relevant analytics events', async ({ calculator ,page }) => {

    const analyticsEvents = await captureSegmentEvents(page);

    // 2️⃣ Navigate to calculators page
    await calculator.goto();

    // 3️⃣ Click Budget Calculator card
    await calculator.clickBudgetCalculatorCard();
    await page.waitForTimeout(1500); // wait for analytics, maybe better if we use retry, but fail case will make it run longer. we can impreove later.

    // 4️⃣ Verify "User viewed screen" event
    const viewedScreenEvent = analyticsEvents.find(
      e => e.event === 'User viewed screen' && e.properties?.screenName === 'Budget Calculator'
    );
    verifyAnalyticsEvent(viewedScreenEvent, {
      'properties.screenName': 'Budget Calculator',
    });

    // 5️⃣ Fill income and verify analytics
    await calculator.fillIncome('9000');
    await page.waitForTimeout(1500); // wait for analytics, maybe better if we use retry, but fail case will make it run longer. we can impreove later.

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
    await calculator.fillZipCode('94040');
    await page.waitForTimeout(1500); // wait for analytics, maybe better if we use retry, but fail case will make it run longer. we can impreove later.

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
    await calculator.clickCalculate();
    await page.waitForTimeout(1500);

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
