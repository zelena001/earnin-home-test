import { Page, Locator, TestInfo } from '@playwright/test';

export class CommunityPage {
 //private projectName: string;

  constructor(private page: Page, private projectName: string) 
  //constructor(private page: Page, projectName: string) 
  {
    this.projectName = projectName;
  }

  // --- Locators ---
  get searchTextBox(): Locator {
    return this.page.locator('[data-testid="member-search"]');
  }

  get statusFilter(): Locator {
    return this.page.locator('button[data-slot="select-trigger"]');
  }

  get statusFilterOptions(): Locator {
    return this.page.locator('[role="option"][data-slot="select-item"]');
  }

  // Adaptive table locator
  get tableRows(): Locator {
    if (this.isMobile()) {
      // Mobile layout
      return this.page.locator('[data-testid="members-table-mobile"] > div[data-slot="card"]');
    } else {
      // Desktop layout
      return this.page.locator('[data-slot="table-body"] > tr');
    }
  }

  // --- Utility ---
  private isMobile(): boolean {
    return this.projectName.toLowerCase().includes('mobile');
  }

  // --- Actions ---
  async goto() {
    await this.page.goto('https://v0-cmlookup2.vercel.app');
    await this.page.waitForLoadState('networkidle');
  }

  async waitForTable() {
    if (this.isMobile()) {
      await this.page.locator('[data-testid="members-table-mobile"] > div[data-slot="card"]').first().waitFor({ state: 'visible', timeout: 5000 });
    } else {
      await this.page.locator('[data-slot="table-body"]').waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  async openCommunityMemberLookup() {
    await this.goto();
    await this.waitForTable();
  }

  async selectStatus(status: string) {
    await this.statusFilter.click();
    const option = this.statusFilterOptions.filter({ hasText: status });
    await option.first().click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  async searchByNameEmailId(text: string) {
    await this.searchTextBox.fill(text);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  // --- Get counts ---
  async getVisibleCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getStatusFilteredMembersCount(status: string): Promise<number> {
    const filtered = this.tableRows.filter({
      has: this.page.locator('span[data-slot="badge"]', { hasText: status })
    });
    return await filtered.count();
  }

  async getMemberCountByName(name: string): Promise<number> {
    const filtered = this.tableRows.filter({
      has: this.page.locator('h3.font-medium', { hasText: name })
    });
    return await filtered.count();
  }

  async getTotalRowsCount(): Promise<number> {
    return await this.tableRows.count();
  }

  async getMemberCountByText(text: string): Promise<number> {
    const filtered = this.tableRows.filter({
      has: this.page.locator('a.block', { hasText: text })
    });
    return await filtered.count();
  }
}



