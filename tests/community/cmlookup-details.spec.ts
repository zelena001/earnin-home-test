import { test, expect, Page } from "@playwright/test";
import { CommunityPage } from "../../pages/CommunityPage";
import memberDataJson from "../../testdata/memberData.json";
import { Member } from "../../interfaces/communityMember";
import { verifyMemberPageErrorMessages } from "../../helpers/testHelper";

test.describe("Community Member Detail screen", () => {
  let community: CommunityPage;
  const Jennifer: Member = memberDataJson.member.Jennifer.info;

  test.beforeEach(async ({ page }, testInfo) => {
    // Initialize CommunityPage directly
    community = new CommunityPage(page, !!testInfo.project.use.isMobile);
    await community.goto();
  });

  test("Click member list and validate member status is correctly displayed", async () => {
    const memberDetailPage = await community.clickMemberByText(Jennifer.name);
    await memberDetailPage.verifyMemberInfo(Jennifer);
  });

  test("User landing on non-existent member detail screen should see default message correctly", async ({ page }) => {
    await verifyMemberPageErrorMessages(
      page,
      "123456789",
      "Member Not Found",
      "The member you're looking for doesn't exist or has been removed."
    );
  });

  test("Member detail screen should support dynamic error message from the back end correctly", async ({ page }) => {
    await verifyMemberPageErrorMessages(
      page,
      "987654321",
      "Member Not Ready",
      "This member is pending review by account manager. Please wait.",
      {
        "The member you're looking for doesn't exist or has been removed.":
          "This member is pending review by account manager. Please wait.",
        "Member Not Found": "Member Not Ready",
      }
    );
  });
});
