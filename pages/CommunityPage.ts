import { Page } from '@playwright/test';

export class CommunityPage {
  // Define locator path
  private searchTextBox = '[data-testid="member-search"]'; 
  
  private statusFilter = '[role="combobox"][data-slot="select-trigger"]';
  private statusFilter = this.page.getByRole('combobox', { name: /status/i });

  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('https://v0-cmlookup2.vercel.app');
  }

  async filterByStatus(status: string) {
    await this.page.getByRole('combobox', { name: /status/i }).selectOption(status);
    await this.page.waitForTimeout(1000);
  }

  async searchByNameOrEmail(text: string) {
    await this.page.fill(this.searchTextBox, text); // use the locator here
    await this.page.keyboard.press('Enter');        // if Enter triggers search
    await this.page.waitForTimeout(1000);           // optional wait
  }

  async getVisibleCount() {
    return await this.page.locator('.member-row').count();
  }
}
