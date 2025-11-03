// import { test, expect } from '@playwright/test';
import { test } from "../../fixtures/communitiesFixture";
import memberDataJson from "../../testdata/memberData.json";
import { Member } from "../../interfaces/communityMember";
import { verifyMemberPageErrorMessages } from "../../helpers/testHelper";

test.describe("Community Member Detail screen", () => {
  const Jennifer: Member = memberDataJson.member.Jennifer.info;
  test("Click member list and validate member status is correctly display", async ({
    community,
  }) => {
    await community.goto();
    const memberDetailPage = await community.clickMemberByText(Jennifer.name);
    await memberDetailPage.verifyMemberInfo(Jennifer);
  });

  test("User landing on non-exist memer detail screen should see default message correctly", async ({
    page
  }) => {
    await verifyMemberPageErrorMessages(
    page,
    "123456789",
    "Member Not Found",
    "The member you're looking for doesn't exist or has been removed."
  );
  });

  test("Member detail screen should suppport dynamic error message from the back end correctly", async ({
    page
  }) => {
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
