import { Page, expect } from '@playwright/test';

export class MemberDetailPage {
  constructor(private page: Page) {}

  // Use double quotes or backticks to avoid escaping single quote
  notFoundMessage = this.page.locator("text=doesn't exist or has been removed");

  async gotoByName(name: string) {
    await this.page.goto('/');
    await this.page.getByText(name).click();
  }

  async gotoById(id: string) {
    await this.page.goto(`/members/${id}`);
  }

  async expectStatuses(expected: { kyc: string; cashout: string; account: string }) {
    await expect(this.page.getByText(`KYC Status: ${expected.kyc}`)).toBeVisible();
    await expect(this.page.getByText(`Cashout Status: ${expected.cashout}`)).toBeVisible();
    await expect(this.page.getByText(`Account Status: ${expected.account}`)).toBeVisible();
  }
}
