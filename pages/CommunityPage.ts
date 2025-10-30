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

  // Locator for all table rows
  get tableRows(): Locator {
    return this.page.locator(
      '[data-slot="table-body"] > tr'
    );
  }

  constructor(private page: Page) {}

  // Navigate to main page
  async goto() {
    await this.page.goto('https://v0-cmlookup2.vercel.app');
    
  }

  async waitForTable() {
  await this.page.locator('[data-slot="table-body"]').waitFor({ state: 'visible', timeout: 5000 });
}

async openCommunityMemberLookup() {
  await this.page.goto('https://v0-cmlookup2.vercel.app');
  await this.page.waitForLoadState('networkidle');
  await this.waitForTable();
}

  // Select a status from the dropdown
  async selectStatus(status: string) {
    await this.statusFilter.click();
    const option = this.statusFilterOptions.filter({ hasText: status });
    await option.first().click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  // Search by name or email
  async searchByNameEmailId(text: string) {
    await this.searchTextBox.fill(text);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  
// Get the count of visible members
async getVisibleCount(): Promise<number> {
  return await this.tableRows.count();
}

// Get the count of members with status filtered
async getStatusFilteredMembersCount(status: string): Promise<number> {
  const activeRows = this.tableRows.filter({
    has: this.page.locator('span[data-slot="badge"]', { hasText: status})
  });
  return await activeRows.count();
}


// Count rows containing a specific member name
async getMemberCountByName(name: string): Promise<number> {
  const matchingRows = this.tableRows.filter({
    has: this.page.locator('h3[class="font-medium"]', { hasText: name })
  });
  return await matchingRows.count();
}

async getTotalRowsCount(): Promise<number> {
  return await this.tableRows.count();
}

async getMemeberCountByText(text: string): Promise<number> {
    const matchingRows = this.tableRows.filter({
    has: this.page.locator('a.block', { hasText: text })
  });
  return await matchingRows.count();
}
}
