import { test } from "../../fixtures/calculatorFixture";
import {
  captureSegmentEvents,
  verifyAnalyticsEventTrigger,
} from "../../helpers/analyticsHelper";

test.describe("Budget Calculator Analytics", () => {
  test("should capture all relevant analytics events", async ({
    calculator,
    page,
  }) => {
    // Start capturing Segment analytics
    const analyticsEvents = await captureSegmentEvents(page);

    // Step 1: Navigate to calculator page
    await calculator.goto();

    // Step 2: Open Budget Calculator
    await calculator.clickBudgetCalculatorCard();

    // Verify "User viewed screen" event
    verifyAnalyticsEventTrigger(analyticsEvents, {
      event: "User viewed screen",
      "properties.screenName": "Budget Calculator",
    });

    // Step 3: Fill income and verify analytics
    await calculator.fillIncome("9000");

    verifyAnalyticsEventTrigger(analyticsEvents, {
      event: "User interacted with element",
      "properties.elementName": "Income",
      "properties.component": "Input Field",
    });

    // Step 4: Fill Zip Code and verify analytics
    await calculator.fillZipCode("94040");

    verifyAnalyticsEventTrigger(analyticsEvents, {
      event: "User interacted with element",
      "properties.elementName": "Zip Code",
      "properties.component": "Input Field",
    });

    // Step 5: Click Calculate and verify analytics
    await calculator.clickCalculate();

    verifyAnalyticsEventTrigger(analyticsEvents, {
      event: "User interacted with element",
      "properties.elementName": "Calculate",
      "properties.component": "CTA",
    });
  });
});
