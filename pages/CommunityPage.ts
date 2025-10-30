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
    //return this.page.locator('[data-slot="calendar"] div div:first-child span');
    return this.page.locator('[data-slot="calendar"] div div span').first();
    
  }

  get toMonth(): Locator {
    //return this.page.locator('[data-slot="calendar"] div div:last-child span');
    return this.page.locator('[data-slot="calendar"] div div span').last();
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
    
    // Wait for table/cards to be visible automatically
    if (this.isMobile()) {
      await this.page.locator('[data-testid="members-table-mobile"] > div[data-slot="card"]').first().waitFor({ state: 'visible', timeout: 5000 });
    } else {
      await this.page.locator('[data-slot="table-body"]').waitFor({ state: 'visible', timeout: 5000 });
    }
    await this.page.waitForLoadState('networkidle');
    
  }

  async selectStatus(status: string) {
    await this.statusFilter.click();
    const option = this.statusFilterOptions.filter({ hasText: status });
    await option.first().click();
    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }


  async selectStartDate(date: string) {
    await this.datePicker.click();

    await this.page.waitForTimeout(500);
    await this.page.waitForLoadState('networkidle');
  }

  async searchByText(text: string) {
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

  async goToMonth(targetMonth: string): Promise<void> {
  // Keep looping until the displayed month text includes your targetMonth
  while (true) {
    const currentMonth = await this.fromMonth.textContent();

    if (!currentMonth) {
      throw new Error('Cannot read month text');
    }

    // Trim spaces and check if it contains the target month string
    if (currentMonth.trim().includes(targetMonth)) {
      console.log(`✅ Reached target month: ${currentMonth}`);
      break;
    }

    // Click the "Previous Month" button
    await this.previousMonthBtn.click();

    // Wait for the calendar to update after each click
    await this.page.waitForTimeout(300); // small delay for UI update
  }
}

async selectFromDate(targetDate: string): Promise<void> {
  const dateLocator = this.page.locator(`[data-day="${targetDate}"]`);

  const maxTries = 24; // safety limit (2 years)
  let tries = 0;

  while (true) {
    // Check if the target date is visible
    const isVisible = await dateLocator.isVisible();

    if (isVisible) {
      console.log(`✅ Found target date: ${targetDate}`);
      
      // await dateLocator.scrollIntoViewIfNeeded();
      await dateLocator.click({force:true}); // ✅ Click once found
      // await dateLocator.click({force: true});
      break;
    }

    // Prevent infinite loop
    if (tries++ > maxTries) {
      throw new Error(`❌ Could not find target date ${targetDate} after ${maxTries} attempts`);
    }

    // Click previous month
    // await this.previousMonthBtn.scrollIntoViewIfNeeded();
    await this.previousMonthBtn.click({force:true});
    // await this.previousMonthBtn.click({force: true});

    // Wait for the calendar UI to update
    await this.page.waitForTimeout(300);
  }
}


async forceScrollDown() {

    // Scroll the page down 50 pixels
    await this.page.evaluate(() => {
        window.scrollBy(0, 200);
    });
    // Small delay to let layout update
    await this.page.waitForTimeout(100);
}



async selectToDate(targetDate: string): Promise<void> {
  const dateLocator = this.page.locator(`[data-day="${targetDate}"]`);

  const maxTries = 24; // safety limit (2 years)
  let tries = 0;

  while (true) {
    // Check if the target date is visible
    const isVisible = await dateLocator.isVisible();

    if (isVisible) {
      console.log(`✅ Found target date: ${targetDate}`);
      
      //await dateLocator.scrollIntoViewIfNeeded();
      await dateLocator.click({force:true}); // ✅ Click once found
      // await dateLocator.click({force: true});
      break;
    }

    // Prevent infinite loop
    if (tries++ > maxTries) {
      throw new Error(`❌ Could not find target date ${targetDate} after ${maxTries} attempts`);
    }

    // Click previous month
    //await this.nextMonthBtn.scrollIntoViewIfNeeded();
    await this.nextMonthBtn.click({force: true});
    // await this.nextMonthBtn.click({force: true});

    // Wait for the calendar UI to update
    await this.page.waitForTimeout(300);
  }
}


async getMemberCountByDateRange(fromDate: string, toDate: string): Promise<number> {
  const from = dayjs(fromDate, 'M/D/YYYY').startOf('day');
  const to = dayjs(toDate, 'M/D/YYYY').endOf('day');

  const rows = this.tableRows;
  let count = 0;
  const rowCount = await rows.count();

  for (let i = 0; i < rowCount; i++) {
    const row = rows.nth(i);

    let texts: string[];

    if (this.isMobile()) {
      // Mobile: get all inner text from card
      texts = await row.locator('*').allTextContents();
    } else {
      // Desktop: get all cell text in the row
      texts = await row.locator('td').allTextContents();
    }

    let rowHasDate = false;

    for (const text of texts) {
      const rowDate = dayjs(text.trim(), 'MMM DD, YYYY', true); // strict parsing
      if (!rowDate.isValid()) continue;

      if (rowDate.isSameOrAfter(from) && rowDate.isSameOrBefore(to)) {
        rowHasDate = true;
        break; // found a matching date in this row/card
      }
    }

    if (rowHasDate) count++;
  }

  return count;
}
}
