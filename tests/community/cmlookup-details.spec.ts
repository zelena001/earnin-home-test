// import { test, expect } from '@playwright/test';
import { test, expect } from "../../fixtures/communitiesFixture";
import memberDataJson from "../../testdata/memberData.json";
import { Member } from "../../interfaces/communityMember";
import { CommunityPageMemberDetail } from "../../pages/CommunityPageMemberDetail";
import mockMemberFallbackMessages from "../../helpers/mockHelper";

test.describe.only("Community Member Detail screen", () => {
  const Jennifer: Member = memberDataJson.member.Jennifer.info;
  test("Click member list and validate member status is correctly display", async ({
    page,
    community,
  }) => {
    await community.goto();
    await community.clickElementByText(Jennifer.name);
    const memberDetail = new CommunityPageMemberDetail(page);
    await memberDetail.verifyMemberInfo(Jennifer);
  });

  test("User landing on non-exist memer detail screen should see default message correctly", async ({
    page
  }) => {
    const communityPageMemberDetail = new CommunityPageMemberDetail(page);
    await communityPageMemberDetail.goToSpecificMember("123456789");
    await expect(communityPageMemberDetail.errorMessage).toHaveText(
      "The member you're looking for doesn't exist or has been removed."
    );
    await expect(communityPageMemberDetail.errorHeader).toHaveText(
      "Member Not Found"
    );
  });

  test("Member detail screen should suppport dynamic error message from the back end correctly", async ({
    page
  }) => {
    const communityPageMemberDetail = new CommunityPageMemberDetail(page);
    await mockMemberFallbackMessages(page, "987654321", {
      "The member you're looking for doesn't exist or has been removed.":
        "This member is pending review by account manager. Please wait.",
      "Member Not Found": "Member Not Ready",
    });
    await communityPageMemberDetail.goToSpecificMember("987654321");

    await expect(communityPageMemberDetail.errorMessage).toHaveText(
      "This member is pending review by account manager. Please wait."
    );
    await expect(communityPageMemberDetail.errorHeader).toHaveText(
      "Member Not Ready"
    );
  });
});
