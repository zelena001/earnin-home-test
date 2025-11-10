import { test } from "../../fixtures/communitiesFixture";
import { verifyFilteredResult } from "../../helpers/testHelper";
import memberDataJson from "../../testdata/memberData.json";
import { Member } from "../../interfaces/communityMember";

test.describe("Community Member Lookup", () => {
  const Jennifer: Member = memberDataJson.member.Jennifer.info;
  test("filters by Active account status", async ({ community }) => {
    await community.goto();
    const matchedCount = await community.getStatusFilteredMembersCount("Active");
    await community.selectStatus("Active");
    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Member Id", async ({ community }) => {
    await community.goto();
    const matchedCount = await community.getMemberCountByText("543210987");
    await community.searchByText("543210987");
    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Member Name", async ({ community }) => {
    await community.goto();
    const matchedCount = await community.getMemberCountByText(Jennifer.name);
    await community.searchByText(Jennifer.name);
    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Member Email", async ({ community }) => {
    await community.goto();
    const matchedCount = await community.getMemberCountByText(Jennifer.email);
    await community.searchByText(Jennifer.email);
    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Date December 2024 to January 2025", async ({ community, page }) => {
    await community.goto();
    const matchedCount = await community.getMemberCountByDateRange("12/1/2024", "1/31/2025");

    // explicit wait for flickering / small screen issues
    await page.waitForTimeout(1500);
    await community.datePicker.click();
    page.pause();
    await community.selectFromDate("12/1/2024");
    await community.selectToDate("1/31/2025");

    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Date July 2025 to August 2025", async ({ community, page }) => {
    await community.goto();
    const matchedCount = await community.getMemberCountByDateRange("7/1/2025", "8/31/2025");

    await page.waitForTimeout(1500);
    await community.datePicker.click();
    await community.selectFromDate("7/1/2025");
    await community.selectToDate("8/31/2025");

    await verifyFilteredResult(community, matchedCount);
  });
});
