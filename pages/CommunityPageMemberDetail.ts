import { Page, Locator, expect } from '@playwright/test';
import { Member } from '../interfaces/communityMember';

export class CommunityPageMemberDetail {
  constructor(private page: Page) {}
  

  // --- Base container ---
  private get detailHeader(): Locator {
    return this.page.locator('[data-testid="detail-header"]');
  }


//  private statusBaseSelector = '[data-testid="detail-header"] >> div.flex.flex-wrap > div > span.inline-flex.font-medium';
  private statusBaseSelector = '[data-testid="detail-header"] > div.flex.flex-wrap > div'

// Function to get nth div and nth span

  // --- Locators ---
  get memberName(): Locator {
    return this.detailHeader.nth(0).locator('h1').first();
  }
private getStatusHeaderSelectorString(divIndex: number, spanIndex: number): string {
  return `${this.statusBaseSelector}:nth-child(${divIndex + 1}) span:nth-child(${spanIndex + 1})`;
}


get memberKYCStatus(): Locator {
  // for example: divIndex=2, spanIndex=0
  console.log
  return this.getStatusHeaderDetail(0, 1);
}

get cashoutStatus(): Locator {
  // for example: divIndex=2, spanIndex=0
  return this.getStatusHeaderDetail(1, 1);
}

get memberStatus(): Locator {
  
  // for example: divIndex=2, spanIndex=0
  console.log(this.getStatusHeaderSelectorString(2, 1));
  return this.getStatusHeaderDetail(2, 1);
}


  // --- Actions ---
  async goToSpecificMember(number: string) {
    if (!/^\d+$/.test(number)) throw new Error('Member number must be numeric');
    await this.page.goto(`https://v0-cmlookup2.vercel.app/members/${number}`);
  }

  async verifyMemberInfo(member: Member) {
    const name = (await this.memberName.textContent())?.trim();
    const status = (await this.memberStatus.textContent())?.trim();
    const kycStatus = (await this.memberKYCStatus.textContent())?.trim();
        const cashoutStatus = (await this.cashoutStatus.textContent())?.trim();

    expect(name).toEqual(member.name);
    expect(cashoutStatus).toEqual(member.cashOutStatus);
    expect(status).toEqual(member.status);
    expect(kycStatus).toEqual(member.kycStatus);
  }

//   private getStatusHeaderDetail(divIndex: number, spanIndex: number): Locator {
//   return this.page.locator(this.statusBaseSelector)
//                   .nth(divIndex)   // pick the correct div
//                   .locator('span') // span inside the div
//                   .nth(spanIndex); // pick the correct span
// }

private getStatusHeaderDetail(divIndex: number, spanIndex: number): Locator {
  return this.page.locator(this.statusBaseSelector)
                  .nth(divIndex)               // pick the correct div
                  .locator('span.inline-flex.font-medium') // pick spans inside that div
                  .nth(spanIndex);             // pick the correct span
}
}
