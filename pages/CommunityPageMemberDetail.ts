import { Page, Locator, expect } from "@playwright/test";
import { Member } from "../interfaces/communityMember";

export class CommunityPageMemberDetail {
  constructor(private page: Page) {}

  // LOCATORS
  private get detailHeader(): Locator {
    return this.page.locator('[data-testid="detail-header"]');
  }

  private get statusBaseSelector(): Locator {
    return this.page.locator(
      '[data-testid="detail-header"] > div.flex.flex-wrap > div'
    );
  }

  get memberName(): Locator {
    return this.detailHeader.nth(0).locator("h1").first();
  }

  get errorHeader(): Locator {
    return this.page.locator("h2.text-2xl.font-bold.mb-4");
  }

  get errorMessage(): Locator {
    return this.page.locator("p.text-muted-foreground.mb-6");
  }

  // PRIVATE HELPERS
  private getStatusBadge(divIndex: number): Locator {
    return this.statusBaseSelector.nth(divIndex).locator('[data-slot="badge"]');
  }

  private async getBadgeText(divIndex: number): Promise<string> {
    const badge = this.getStatusBadge(divIndex);
    console.log(`Waiting for badge at divIndex=${divIndex}...`);
    await badge.waitFor({ state: "attached", timeout: 5000 });
    const text = await badge.evaluate((el) => el.textContent?.trim() || "");
    console.log(`Badge text at divIndex=${divIndex}: "${text}"`);
    return text;
  }

  // ACTIONS
  async goToSpecificMember(number: string): Promise<void> {
    if (!/^\d+$/.test(number)) throw new Error("Member number must be numeric");
    console.log(`Navigating to member page for member number: ${number}`);
    await this.page.goto(`https://v0-cmlookup2.vercel.app/members/${number}`);
  }

  // ASSERTIONS / VERIFICATIONS
  async verifyMemberInfo(member: Member): Promise<void> {
    console.log(`Verifying member info for: ${member.name}`);

    const name =
      (
        await this.memberName
          .waitFor({ state: "visible" })
          .then(() => this.memberName.textContent())
      )?.trim() || "";

    const kycStatus = await this.getBadgeText(0);
    const cashoutStatus = await this.getBadgeText(1);
    const status = await this.getBadgeText(2);

    expect(
      name,
      `Expected member name to match: ${member.name}, but got: ${name}`
    ).toEqual(member.name);

    expect(
      cashoutStatus,
      `Expected cashout status to match: ${member.cashOutStatus}, but got: ${cashoutStatus}`
    ).toEqual(member.cashOutStatus);

    expect(
      status,
      `Expected member status to match: ${member.status}, but got: ${status}`
    ).toEqual(member.status);

    expect(
      kycStatus,
      `Expected KYC status to match: ${member.kycStatus}, but got: ${kycStatus}`
    ).toEqual(member.kycStatus);

    console.log(`✅ Member info verified successfully for: ${member.name}`);
  }
}
