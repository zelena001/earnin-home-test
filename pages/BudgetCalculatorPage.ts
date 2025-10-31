import { Page } from '@playwright/test';

export class BudgetCalculatorPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://www.earnin.com/financial-calculators');
  }

  async clickBudgetCalculatorCard() {
    await this.page.locator('div[data-testid^="financial-calculator-"]:has-text("Budget calculator")').click();
  }

  async fillIncome(value: string) {
    await this.page.fill('input[data-testid="income"]', value);
  }

  async fillZipCode(value: string) {
    await this.page.fill('input[data-testid="zipcode"]', value);
  }

  async clickCalculate() {
    await this.page.getByRole('button', { name: 'Calculate' }).click();
  }
}
