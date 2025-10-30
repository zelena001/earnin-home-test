import { test, expect } from '@playwright/test';
import { CommunityPage } from '../../pages/CommunityPage';

test.describe('Community Member Lookup', () => {
  test('filters by Active account status', async ({ page }, testInfo) => {
    const community = new CommunityPage(page,  testInfo.project.name);
    await community.goto();
    const matchedMember = await community.getStatusFilteredMembersCount('Active');
    console.log(matchedMember);
    await community.selectStatus('Active');
    const filteredCount = await community.getTotalRowsCount();
    console.log(filteredCount);
    expect(matchedMember).toEqual(filteredCount);
  });

   test('filters by Member Id', async ({ page }, testInfo) => {
    const community = new CommunityPage(page,  testInfo.project.name);
    await community.goto();
    const matchedMember = await community.getMemberCountByText('543210987');
    console.log(matchedMember);
    await community.searchByText('543210987');
    const filteredCount = await community.getTotalRowsCount();
    console.log(filteredCount);
    expect(matchedMember).toEqual(filteredCount);
  });

  test('filters by Member Name', async ({ page }, testInfo) => {
    const community = new CommunityPage(page,  testInfo.project.name);
    await community.goto();
    const matchedMember = await community.getMemberCountByText('Jennifer Brown');
    console.log(matchedMember);
    await community.searchByText('Jennifer Brown');
    const filteredCount = await community.getTotalRowsCount();
    console.log(filteredCount);
    expect(matchedMember).toEqual(filteredCount);
  });

  test('filters by Member Email', async ({ page }, testInfo) => {
    const community = new CommunityPage(page,  testInfo.project.name);
    await community.goto();
    const matchedMember = await community.getMemberCountByText('jennifer.brown@example.com');
    console.log(matchedMember);
    await community.searchByText('jennifer.brown@example.com');
    const filteredCount = await community.getTotalRowsCount();
    console.log(filteredCount);
    expect(matchedMember).toEqual(filteredCount);
  });

//Seem like there is a bug here, the calendar go upward and user can't scroll up to select date
  test('filters by Date December 2024 to Jan 2025', async ({ page }, testInfo) => {
    const community = new CommunityPage(page,  testInfo.project.name);
    await community.goto();
    const matchedMember = await community.getMemberCountByDateRange('12/1/2024', '1/31/2025');
    console.log(matchedMember);
  // This force scroll step is needed because the date picker is not fully visible not shift downward
    await community.forceScrollDown();
     await community.datePicker.click();
    
    await community.selectFromDate('12/1/2024');
    await community.selectToDate('1/31/2025');
    const filteredCount = await community.getTotalRowsCount();
    console.log(filteredCount);
    expect(matchedMember).toEqual(filteredCount);
  });

  //Seem like there is a bug here, the calendar go upward and user can't scroll up to select date
  test('filters by Date July 2025 to August 2025', async ({ page }, testInfo) => {
    const community = new CommunityPage(page,  testInfo.project.name);
    await community.goto();
    const matchedMember = await community.getMemberCountByDateRange('7/1/2025', '8/31/2025');
    console.log(matchedMember);
  // This force scroll step is needed because the date picker is not fully visible not shift downward
    await community.forceScrollDown();
     await community.datePicker.click();
    
    await community.selectFromDate('7/1/2025');
    await community.selectToDate('8/31/2025');
    const filteredCount = await community.getTotalRowsCount();
    console.log(filteredCount);
    expect(matchedMember).toEqual(filteredCount);
  });
});


