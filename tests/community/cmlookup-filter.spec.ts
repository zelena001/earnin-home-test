import { test, expect } from '@playwright/test';
import { CommunityPage } from '../../pages/CommunityPage';

test.describe('Community Member Lookup', () => {
  test('filters by Active account status', async ({ page }, testInfo) => {
    const community = new CommunityPage(page,  testInfo.project.name);
    //await community.openCommunityMemberLookup();
    await community.goto();
    //await page.pause();
    await community.waitForTable();
    const matchedMember = await community.getStatusFilteredMembersCount('Active');
    console.log(matchedMember);
    await community.selectStatus('Active');
    const filteredCount = await community.getTotalRowsCount();
    console.log(filteredCount);
    expect(matchedMember).toEqual(filteredCount);
  });
});


