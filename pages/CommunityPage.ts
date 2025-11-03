import { Page, Locator } from '@playwright/test';
import dayjs from 'dayjs';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import { CommunityPageMemberDetail } from './CommunityPageMemberDetail';

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);


export class CommunityPage {
  
  constructor(private page: Page, private isMobile: boolean) {}

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

  // Adaptive table locator for mobile vs desktop
  get tableRows(): Locator {
    return this.isMobile
      ? this.page.locator('[data-testid="members-table-mobile"] > div[data-slot="card"]')
      : this.page.locator('[data-slot="table-body"] > tr');
  }


  /** Wait for the table/cards to be visible */
  private async waitForTable(): Promise<void> {
    console.log('Waiting for table/cards to be visible...');
    if (this.isMobile) {
      await this.page.locator('[data-testid="members-table-mobile"] > div[data-slot="card"]')
        .first()
        .waitFor({ state: 'visible', timeout: 5000 });
    } else {
      await this.page.locator('[data-slot="table-body"]').waitFor({ state: 'visible', timeout: 5000 });
    }
    console.log('Table/cards are visible.');
  }

  /** Click previous or next month button */
  private async clickMonthButton(useNext: boolean): Promise<void> {
    console.log(`Clicking ${useNext ? 'Next' : 'Previous'} Month button...`);
    if (useNext) {
      await this.nextMonthBtn.click({ force: true });
    } else {
      await this.previousMonthBtn.click({ force: true });
    }
    await this.page.waitForTimeout(300); // wait for calendar UI update
  }

  /** Select a date in the calendar (reusable for start/end date) */
  private async selectDate(targetDate: string, useNext = false): Promise<void> {
    console.log(`Selecting date "${targetDate}" (useNext=${useNext})...`);
    const dateLocator = this.page.locator(`[data-testid="date-calendar"] div:nth-child(2) [data-day="${targetDate}"]`);
    const maxTries = 24; // safety limit (up to 2 years)
    let tries = 0;

    while (!(await dateLocator.isVisible())) {
      if (tries++ > maxTries) {
        throw new Error(`❌ Could not find target date ${targetDate} after ${maxTries} attempts`);
      }
      console.log(`Date not visible yet, clicking month button (attempt ${tries})...`);
      await this.clickMonthButton(useNext);
    }

    await dateLocator.click({ force: true });
    console.log(`Date "${targetDate}" selected.`);
  }

  // --- Actions ---
  /** Navigate to the main community lookup page */
  async goto(): Promise<void> {
    console.log('Navigating to community lookup page...');
    await this.page.goto('https://v0-cmlookup2.vercel.app');
    await this.waitForTable();
    await this.page.waitForLoadState('networkidle');
    console.log('Navigation complete.');
  }

  /** Search members by text */
  async searchByText(text: string): Promise<void> {
    console.log(`Searching for members with text: "${text}"`);
    await this.searchTextBox.fill(text);
    await this.page.keyboard.press('Enter');
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
    console.log('Search complete.');
  }

  /** Filter members by status */
  async selectStatus(status: string): Promise<void> {
    console.log(`Filtering members by status: "${status}"`);
    await this.statusFilter.click();
    await this.statusFilterOptions.filter({ hasText: status }).first().click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
    console.log('Status filter applied.');
  }

  /** Open the start date picker */
  async selectStartDate(date: string): Promise<void> {
    console.log(`Opening date picker (start date: "${date}")...`);
    await this.datePicker.click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
    console.log('Date picker opened.');
  }

  /** Navigate calendar to a specific month */
  async goToMonth(targetMonth: string): Promise<void> {
    console.log(`Navigating to month: "${targetMonth}"`);
    while (true) {
      const currentMonth = (await this.fromMonth.textContent())?.trim();
      if (!currentMonth) throw new Error('Cannot read month text');
      if (currentMonth.includes(targetMonth)) break;
      await this.previousMonthBtn.click();
      await this.page.waitForTimeout(300);
    }
    console.log(`Reached target month: "${targetMonth}"`);
  }

  /** Select a start date in the calendar */
  async selectFromDate(targetDate: string): Promise<void> {
    await this.selectDate(targetDate, false);
  }

  /** Select an end date in the calendar */
  async selectToDate(targetDate: string): Promise<void> {
    await this.selectDate(targetDate, true);
  }

  /** Scroll the page down slightly */
  async forceScrollDown(): Promise<void> {
    console.log('Scrolling page down...');
    await this.page.evaluate(() => window.scrollBy(0, 200));
    await this.page.waitForTimeout(100);
    console.log('Scroll complete.');
  }

  // --- Counts ---
  /** Count visible rows/cards */
  async getVisibleCount(): Promise<number> {
    const count = await this.tableRows.count();
    console.log(`Visible rows/cards count: ${count}`);
    return count;
  }

  /** Count members filtered by status badge */
  async getStatusFilteredMembersCount(status: string): Promise<number> {
    const count = await this.tableRows
      .filter({ has: this.page.locator('span[data-slot="badge"]', { hasText: status }) })
      .count();
    console.log(`Members with status "${status}": ${count}`);
    return count;
  }

  /** Count members by exact name */
  async getMemberCountByName(name: string): Promise<number> {
    const count = await this.tableRows
      .filter({ has: this.page.locator('h3.font-medium', { hasText: name }) })
      .count();
    console.log(`Members with name "${name}": ${count}`);
    return count;
  }

  /** Count members by any text content */
  async getMemberCountByText(text: string): Promise<number> {
    const count = await this.tableRows
      .filter({ has: this.page.locator('a.block', { hasText: text }) })
      .count();
    console.log(`Members with text "${text}": ${count}`);
    return count;
  }

  /** Count all rows/cards */
  async getTotalRowsCount(): Promise<number> {
    const count = await this.tableRows.count();
    console.log(`Total rows/cards count: ${count}`);
    return count;
  }

  /** Count members whose date falls in a range */
  async getMemberCountByDateRange(fromDate: string, toDate: string): Promise<number> {
    console.log(`Counting members from "${fromDate}" to "${toDate}"`);
    const from = dayjs(fromDate, 'M/D/YYYY').startOf('day');
    const to = dayjs(toDate, 'M/D/YYYY').endOf('day');

    const rows = this.tableRows;
    let count = 0;
    const rowCount = await rows.count();

    for (let i = 0; i < rowCount; i++) {
      const row = rows.nth(i);
      const texts = this.isMobile
        ? await row.locator('*').allTextContents()
        : await row.locator('td').allTextContents();

      if (texts.some(text => {
        const rowDate = dayjs(text.trim(), 'MMM DD, YYYY', true);
        return rowDate.isValid() && rowDate.isSameOrAfter(from) && rowDate.isSameOrBefore(to);
      })) {
        count++;
      }
    }

    console.log(`Members count in date range: ${count}`);
    return count;
  }

  // --- Misc ---
  /** Click first element matching the given text */
  // async clickElementByText(text: string): Promise<void> {
  //   console.log(`Clicking element with text: "${text}"`);
  //   await this.tableRows.locator(`text=${text}`).first().click();
  //   console.log('Click complete.');
  // }

  async clickMemberByText(name: string): Promise<CommunityPageMemberDetail> {
    await this.tableRows.locator(`text=${name}`).first().click();
    // Wait until member detail page is loaded (e.g. header or URL check)
    await this.page.waitForURL(/\/members\//);
    return new CommunityPageMemberDetail(this.page);
  }
}
