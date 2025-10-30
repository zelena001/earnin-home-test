import { Page } from '@playwright/test';

export class BudgetCalculatorPage {
  constructor(private page: Page) {}

  // Navigate to the Budget Calculator page
  async goto() {
    await this.page.goto('https://www.earnin.com/financial-calculators');
    // Click the Budget calculator card
    await this.page.getByText('Budget calculator').click();
  }

  // Fill the form
  async fillForm(data: { income: number; zipcode: string }) {
    await this.page.getByLabel('Take home income').fill(data.income.toString());
    await this.page.getByLabel('Zip Code').fill(data.zipcode);
  }

  // Click calculate button
  async calculate() {
    await this.page.getByRole('button', { name: /calculate/i }).click();
  }

  // Capture analytics events sent to /t endpoint
  async captureAnalyticsEvents(callback: () => Promise<void>) {
    const events: any[] = [];

    // Intercept network requests to /t endpoint
    await this.page.route('**/t', async (route) => {
      const request = route.request();
      if (request.method() === 'POST') {
        const postData = request.postData();
        if (postData) {
          events.push(JSON.parse(postData));
        }
      }
      await route.continue();
    });

    // Execute user actions
    await callback();

    return events;
  }
}
