import { test, expect, Page } from "@playwright/test";
import { CommunityPage } from "../../pages/CommunityPage";
import { verifyFilteredResult } from "../../helpers/testHelper";

test.describe("Community Member Lookup", () => {
  let community: CommunityPage;

  test.beforeEach(async ({ page }, testInfo) => {
    // Initialize CommunityPage directly
    community = new CommunityPage(page, !!testInfo.project.use.isMobile);
    await community.goto();
  });

  test("filters by Active account status", async () => {
    const matchedCount = await community.getStatusFilteredMembersCount("Active");
    await community.selectStatus("Active");
    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Member Id", async () => {
    const matchedCount = await community.getMemberCountByText("543210987");
    await community.searchByText("543210987");
    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Member Name", async () => {
    const matchedCount = await community.getMemberCountByText("Jennifer Brown");
    await community.searchByText("Jennifer Brown");
    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Member Email", async () => {
    const matchedCount = await community.getMemberCountByText("jennifer.brown@example.com");
    await community.searchByText("jennifer.brown@example.com");
    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Date December 2024 to January 2025", async ({ page }) => {
    const matchedCount = await community.getMemberCountByDateRange(
      "12/1/2024",
      "1/31/2025"
    );

    // explicit wait for flickering / small screen issues
    await page.waitForTimeout(1500);
    await community.datePicker.click();
    await community.selectFromDate("12/1/2024");
    await community.selectToDate("1/31/2025");

    await verifyFilteredResult(community, matchedCount);
  });

  test("filters by Date July 2025 to August 2025", async ({ page }) => {
    const matchedCount = await community.getMemberCountByDateRange(
      "7/1/2025",
      "8/31/2025"
    );

    await page.waitForTimeout(1500);
    await community.datePicker.click();
    await community.selectFromDate("7/1/2025");
    await community.selectToDate("8/31/2025");

    await verifyFilteredResult(community, matchedCount);
  });
});
