import { Page, expect, Locator } from "@playwright/test";
import { CommunityPageMemberDetail } from "../pages/CommunityPageMemberDetail"; 
import mockMemberFallbackMessages from "./mockHelper"; 

export async function verifyMemberPageErrorMessages(
  page: Page,
  memberId: string,
  expectedHeader: string,
  expectedMessage: string,
  mockMessages?: Record<string, string>
) {
  const communityPageMemberDetail = new CommunityPageMemberDetail(page);

  if (mockMessages) {
    await mockMemberFallbackMessages(page, memberId, mockMessages);
  }

  await communityPageMemberDetail.goToSpecificMember(memberId);
  await expect(communityPageMemberDetail.errorHeader).toHaveText(expectedHeader);
  await expect(communityPageMemberDetail.errorMessage).toHaveText(expectedMessage);
}


/**
 * Verifies the count text dynamically, handling singular/plural
 * @param locator Playwright Locator for the element containing the count text
 * @param expectedCount The expected numeric count
 */
export async function expectMemberCountText(locator: Locator, expectedCount: number) {
  const text = await locator.textContent();
  if (!text) throw new Error('Count element has no text content');

  const expectedText = `${expectedCount} member${expectedCount !== 1 ? 's' : ''} found`;
  expect(text.trim()).toEqual(expectedText);
}