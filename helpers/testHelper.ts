import { Page, expect } from "@playwright/test";
import { CommunityPageMemberDetail } from "../pages/CommunityPageMemberDetail"; 
import mockMemberFallbackMessages from "../helpers/mockHelper"; 

export async function verifyErrorMessages(
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
