import { Page, Locator, expect } from '@playwright/test';
import { Member } from '../interfaces/communityMember';

export class CommunityPageMemberDetail {
  constructor(private page: Page) {}

  // --- Base container ---
  private get detailHeader(): Locator {
    return this.page.locator('[data-testid="detail-header"]');
  }

  // Base selector for the divs containing spans
  private statusBaseSelector = '[data-testid="detail-header"] > div.flex.flex-wrap > div';

  // --- Helper functions ---
  /** Returns a CSS selector string for debugging in DevTools */
  private getStatusHeaderSelectorString(divIndex: number, spanIndex: number): string {
    return `${this.statusBaseSelector}:nth-child(${divIndex + 1}) span.inline-flex.font-medium:nth-child(${spanIndex + 1})`;
  }

  /** Returns a Playwright Locator for the given div and span indexes */
  private getStatusHeaderDetail(divIndex: number, spanIndex: number): Locator {
    console.log('Locator debug:', this.getStatusHeaderSelectorString(divIndex, spanIndex));
    return this.page.locator(this.statusBaseSelector)
                    .nth(divIndex)
                    .locator('span.inline-flex.font-medium')
                    .nth(spanIndex);
  }

  /** Returns the visible text of a status span, accounting for nested elements */
  private async getStatusText(divIndex: number, spanIndex: number): Promise<string> {
    const locator = this.getStatusHeaderDetail(divIndex, spanIndex);
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    return locator.evaluate(el => el.textContent?.trim() || '');
  }

  // --- Locators ---
  get memberName(): Locator {
    return this.detailHeader.nth(0).locator('h1').first();
  }

  get errorMessage(): Locator {
    return this.page.locator('p[class="text-muted-foreground mb-6"]');
  }

  get errorHeader(): Locator {
    return this.page.locator('h2[class="text-2xl font-bold mb-4"]');
  }



  // Indexes can be adjusted based on your DOM
  async memberKYCStatusText(): Promise<string> {
    return this.getStatusText(0, 1);
  }

  async cashoutStatusText(): Promise<string> {
    return this.getStatusText(1, 1);
  }

  async memberStatusText(): Promise<string> {
    return this.getStatusText(2, 1);
  }

  // --- Actions ---
  async goToSpecificMember(number: string) {
    if (!/^\d+$/.test(number)) throw new Error('Member number must be numeric');
    await this.page.goto(`https://v0-cmlookup2.vercel.app/members/${number}`);
  }

  async verifyMemberInfo(member: Member) {
    const name = (await this.memberName.waitFor({ state: 'visible' }).then(() => this.memberName.textContent()))?.trim() || '';
    const status = await this.getBadgeText(2);
const kycStatus = await this.getBadgeText(0);
const cashoutStatus = await this.getBadgeText(1);

    expect(name).toEqual(member.name);
    expect(cashoutStatus).toEqual(member.cashOutStatus);
    expect(status).toEqual(member.status);
    expect(kycStatus).toEqual(member.kycStatus);
  }

  private getStatusBadge(divIndex: number): Locator {
  return this.page.locator(`${this.statusBaseSelector}:nth-child(${divIndex + 1}) [data-slot="badge"]`);
}

private async getBadgeText(divIndex: number): Promise<string> {
  const badge = this.getStatusBadge(divIndex);
  //need to recheck if this is needed?
  await badge.waitFor({ state: 'attached', timeout: 5000 }); // use 'attached' first
  return badge.evaluate(el => el.textContent?.trim() || '');
}

}