import { Page, Locator } from '@playwright/test';

export class CommunityPage {

  // Locators
  get searchTextBox(): Locator {
    return this.page.locator('[data-testid="member-search"]');
  }

  get statusFilter(): Locator {
    return this.page.locator('button[data-slot="select-trigger"]');
  }

  get statusFilterOptions(): Locator {
    return this.page.locator('[role="option"][data-slot="select-item"]');
  }

  constructor(private page: Page) {}

  // Navigate to main page
  async goto() {
    await this.page.goto('https://v0-cmlookup2.vercel.app');
  }

  // Select a status from the dropdown
  async selectStatus(status: string) {
    // Open the dropdown
    await this.statusFilter.click();

    // Click the option by visible text
    const option = this.statusFilterOptions.filter({ hasText: status });
    await option.first().click();

    // Optional wait for UI to update
    await this.page.waitForTimeout(500);
  }

  // Search by name or email
  async searchByNameOrEmail(text: string) {
    await this.searchTextBox.fill(text);
    await this.page.keyboard.press('Enter'); // trigger search
    await this.page.waitForTimeout(500);
  }

  // Get the count of visible members
  async getVisibleCount(): Promise<number> {
    return await this.page.locator('.member-row').count();
  }
}
