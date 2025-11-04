import { Page, expect, Locator } from "@playwright/test";
import { CommunityPageMemberDetail } from "../pages/CommunityPageMemberDetail";
import { CommunityPage } from "../pages/CommunityPage";
import mockMemberFallbackMessages from "./mockHelper";

/**
 * Navigate to a member's page and verify error messages.
 *
 * @param page - The Playwright Page object
 * @param memberId - The ID of the member to navigate to
 * @param expectedHeader - Expected header text of the error message
 * @param expectedMessage - Expected body text of the error message
 * @param mockMessages - Optional map of mocked fallback messages for the member
 */
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
  await expect(communityPageMemberDetail.errorHeader).toHaveText(
    expectedHeader
  );
  await expect(communityPageMemberDetail.errorMessage).toHaveText(
    expectedMessage
  );
}

/**
 * Verifies the text of a member count element, handling singular/plural forms.
 *
 * @param locator - Playwright Locator for the element containing the count text
 * @param expectedCount - The expected numeric count
 */
export async function expectMemberCountText(
  locator: Locator,
  expectedCount: number
) {
  const text = await locator.textContent();
  if (!text) throw new Error("Count element has no text content");

  const expectedText = `${expectedCount} member${
    expectedCount !== 1 ? "s" : ""
  } found`;
  expect(text.trim()).toEqual(expectedText);
}

/**
 * Verifies the filtered results of the community members table.
 * Combines row count validation and count text verification.
 *
 * @param community - Instance of CommunityPage
 * @param matchedCount - Expected number of matching rows after filtering
 */
export async function verifyFilteredResult(
  community: CommunityPage,
  matchedCount: number
) {
  const filteredCount = await community.getTotalRowsCount();
  await expectMemberCountText(community.countElement, matchedCount);
  expect(filteredCount).toEqual(matchedCount);
}
