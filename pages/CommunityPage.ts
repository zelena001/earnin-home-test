import { Page, Locator } from '@playwright/test';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export class CommunityPage {
  constructor(private page: Page, private projectName: string) {}

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

  get datePicker(): Locator {
    return this.page.locator('[data-testid="date-range-picker"]');
  }

  get previousMonthBtn(): Locator {
    return this.page.locator('button[aria-label="Go to the Previous Month"]');
  }

  get nextMonthBtn(): Locator {
    return this.page.locator('button[aria-label="Go to the Next Month"]');
  }

  get fromMonth(): Locator {
    return this.page.locator('[data-slot="calendar"] div div span').first();
  }

  get toMonth(): Locator {
    return this.page.locator('[data-slot="calendar"] div div span').last();
  }

  get tableRows(): Locator {
    return this.isMobile()
      ? this.page.locator('[data-testid="members-table-mobile"] > div[data-slot="card"]')
      : this.page.locator('[data-slot="table-body"] > tr');
  }

  // --- Utilities ---
  private isMobile(): boolean {
    return this.projectName.toLowerCase().includes('mobile');
  }

  private async waitForTable(): Promise<void> {
    if (this.isMobile()) {
      await this.page.locator('[data-testid="members-table-mobile"] > div[data-slot="card"]').first().waitFor({ state: 'visible', timeout: 5000 });
    } else {
      await this.page.locator('[data-slot="table-body"]').waitFor({ state: 'visible', timeout: 5000 });
    }
  }

  private async clickMonthButton(useNext: boolean): Promise<void> {
    if (useNext) {
      await this.nextMonthBtn.click({ force: true });
    } else {
      await this.previousMonthBtn.click({ force: true });
    }
    await this.page.waitForTimeout(300);
  }

  private async selectDate(targetDate: string, useNext = false): Promise<void> {
    const dateLocator = this.page.locator(`[data-testid="date-calendar"] div:nth-child(2) [data-day="${targetDate}"]`);
    const maxTries = 24;
    let tries = 0;

    while (!(await dateLocator.isVisible())) {
      if (tries++ > maxTries) throw new Error(`❌ Could not find target date ${targetDate} after ${maxTries} attempts`);
      await this.clickMonthButton(useNext);
    }

    await dateLocator.click({ force: true });
  }

  // --- Actions ---
  async goto(): Promise<void> {
    await this.page.goto('https://v0-cmlookup2.vercel.app');
    await this.waitForTable();
    await this.page.waitForLoadState('networkidle');
  }

  async searchByText(text: string): Promise<void> {
    await this.searchTextBox.fill(text);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  async selectStatus(status: string): Promise<void> {
    await this.statusFilter.click();
    await this.statusFilterOptions.filter({ hasText: status }).first().click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  async selectStartDate(date: string): Promise<void> {
    await this.datePicker.click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  async goToMonth(targetMonth: string): Promise<void> {
    while (true) {
      const currentMonth = (await this.fromMonth.textContent())?.trim();
      if (!currentMonth) throw new Error('Cannot read month text');
      if (currentMonth.includes(targetMonth)) break;
      await this.previousMonthBtn.click();
      await this.page.waitForTimeout(300);
    }
  }

  async selectFromDate(targetDate: string): Promise<void> {
    await this.selectDate(targetDate, false);
  }

  async selectToDate(targetDate: string): Promise<void> {
    await this.selectDate(targetDate, true);
  }

  async forceScrollDown(): Promise<void> {
    await this.page.evaluate(() => window.scrollBy(0, 200));
    await this.page.waitForTimeout(100);
  }

  // --- Counts ---
  async getVisibleCount(): Promise<number> {
    return this.tableRows.count();
  }

  async getStatusFilteredMembersCount(status: string): Promise<number> {
    return this.tableRows.filter({ has: this.page.locator('span[data-slot="badge"]', { hasText: status }) }).count();
  }

  async getMemberCountByName(name: string): Promise<number> {
    return this.tableRows.filter({ has: this.page.locator('h3.font-medium', { hasText: name }) }).count();
  }

  async getMemberCountByText(text: string): Promise<number> {
    return this.tableRows.filter({ has: this.page.locator('a.block', { hasText: text }) }).count();
  }

  async getTotalRowsCount(): Promise<number> {
    return this.tableRows.count();
  }

  async getMemberCountByDateRange(fromDate: string, toDate: string): Promise<number> {
    const from = dayjs(fromDate, 'M/D/YYYY').startOf('day');
    const to = dayjs(toDate, 'M/D/YYYY').endOf('day');

    const rows = this.tableRows;
    let count = 0;
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const texts = this.isMobile()
        ? await row.locator('*').allTextContents()
        : await row.locator('td').allTextContents();

      if (texts.some(text => {
        const rowDate = dayjs(text.trim(), 'MMM DD, YYYY', true);
        return rowDate.isValid() && rowDate.isSameOrAfter(from) && rowDate.isSameOrBefore(to);
      })) {
        count++;
      }
    }

    return count;
  }

  // --- Misc ---
  async clickElementByText(text: string): Promise<void> {
    await this.tableRows.locator(`text=${text}`).first().click();
  }
}
