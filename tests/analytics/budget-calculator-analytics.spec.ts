import { test, expect } from '@playwright/test';
import { BudgetCalculatorPage } from '../../pages/BudgetCalculatorPage';
import { validateEventSchema } from '../../utils/analyticsHelper';

test('analytics event validation on Budget Calculator', async ({ page }) => {
  const calculator = new BudgetCalculatorPage(page);
  await calculator.goto();

  const events = await calculator.captureAnalyticsEvents(async () => {
    await calculator.fillForm({ income: 9000, zipcode: '94040' });
    await calculator.calculate();
  });

  for (const event of events) {
    validateEventSchema(event);
  }

  const incomeEvent = events.find(e => e.elementName === 'Income');
  expect(incomeEvent?.values?.screenName).toBe('Budget Calculator');
});
