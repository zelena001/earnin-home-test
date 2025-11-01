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
  /** Returns a Playwright Locator for the given div and span indexes */
  private getStatusHeaderDetail(divIndex: number, spanIndex: number): Locator {
    return this.page.locator(this.statusBaseSelector)
                    .nth(divIndex)
                    .locator('span.inline-flex.font-medium')
                    .nth(spanIndex);
  }

  /** Returns the visible text of a status span */
  private async getStatusText(divIndex: number, spanIndex: number): Promise<string> {
    const locator = this.getStatusHeaderDetail(divIndex, spanIndex);
    console.log(`Waiting for status span at divIndex=${divIndex}, spanIndex=${spanIndex} to be visible...`);
    await locator.waitFor({ state: 'visible', timeout: 5000 });
    const text = await locator.evaluate(el => el.textContent?.trim() || '');
    console.log(`Status text at divIndex=${divIndex}, spanIndex=${spanIndex}: "${text}"`);
    return text;
  }

  /** Returns the badge locator for a given div index */
  private getStatusBadge(divIndex: number): Locator {
    return this.page.locator(`${this.statusBaseSelector}:nth-child(${divIndex + 1}) [data-slot="badge"]`);
  }

  /** Returns the text content of a badge */
  private async getBadgeText(divIndex: number): Promise<string> {
    const badge = this.getStatusBadge(divIndex);
    console.log(`Waiting for badge at divIndex=${divIndex} to be attached...`);
    await badge.waitFor({ state: 'attached', timeout: 5000 });
    const text = await badge.evaluate(el => el.textContent?.trim() || '');
    console.log(`Badge text at divIndex=${divIndex}: "${text}"`);
    return text;
  }

  // --- Locators ---
  get memberName(): Locator {
    return this.detailHeader.nth(0).locator('h1').first();
  }

  get errorMessage(): Locator {
    return this.page.locator('p.text-muted-foreground.mb-6');
  }

  get errorHeader(): Locator {
    return this.page.locator('h2.text-2xl.font-bold.mb-4');
  }

  // --- Status getters ---
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
  async goToSpecificMember(number: string): Promise<void> {
    if (!/^\d+$/.test(number)) throw new Error('Member number must be numeric');
    console.log(`Navigating to member page for member number: ${number}`);
    await this.page.goto(`https://v0-cmlookup2.vercel.app/members/${number}`);
  }

  async verifyMemberInfo(member: Member): Promise<void> {
    console.log(`Verifying member info for: ${member.name}`);

    const name = (await this.memberName.waitFor({ state: 'visible' })
      .then(() => this.memberName.textContent()))?.trim() || '';
    console.log(`Member name on page: "${name}"`);

    const kycStatus = await this.getBadgeText(0);
    const cashoutStatus = await this.getBadgeText(1);
    const status = await this.getBadgeText(2);

    // --- Assertions with messages for easier debugging ---
    expect(name, `Expected member name to match: ${member.name}, but got: ${name}`).toEqual(member.name);
    expect(cashoutStatus, `Expected cashout status to match: ${member.cashOutStatus}, but got: ${cashoutStatus}`).toEqual(member.cashOutStatus);
    expect(status, `Expected member status to match: ${member.status}, but got: ${status}`).toEqual(member.status);
    expect(kycStatus, `Expected KYC status to match: ${member.kycStatus}, but got: ${kycStatus}`).toEqual(member.kycStatus);

    console.log(`✅ Member info verified successfully for: ${member.name}`);
  }
}
