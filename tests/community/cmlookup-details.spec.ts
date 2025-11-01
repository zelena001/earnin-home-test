// import { test, expect } from '@playwright/test';
import { test,expect } from '../../fixtures/communitiesFixture.ts';
import { CommunityPage } from '../../pages/CommunityPage';
import memberDataJson from '../../testdata/memberData.json';
import { Member } from '../../interfaces/communityMember.ts';
import { CommunityPageMemberDetail } from '../../pages/CommunityPageMemberDetail';
import mockMemberFallbackMessages from '../../utils/mockHelper';

test.describe('Community Member Detail screen', () => {
const Jennifer: Member = memberDataJson.member.Jennifer.info;
  test('Click member list and validate member status is correctly display', async ({ page, community }) => {

    await community.goto();
await community.clickElementByText(Jennifer.name);
const memberDetail = new CommunityPageMemberDetail(page);
await memberDetail.verifyMemberInfo(Jennifer);


  });

  test('User landing on non-exist memer detail screen should see default message correctly', async ({ page },) => {
    const communityPageMemberDetail = new CommunityPageMemberDetail(page);
  await page.goto('https://v0-cmlookup2.vercel.app/members/123456789');
  await expect(communityPageMemberDetail.errorMessage).toHaveText('The member you\'re looking for doesn\'t exist or has been removed.');
 await expect(communityPageMemberDetail.errorHeader).toHaveText('Member Not Found');
});

test('Member detail screen should suppport dynamic error message from the back end correctly', async ({ page }) => {
    const communityPageMemberDetail = new CommunityPageMemberDetail(page);
    await mockMemberFallbackMessages(page, '123456789', {
  "The member you're looking for doesn't exist or has been removed.": "This member is pending review by account manager. Please wait.",
  "Member Not Found": "Member Not Ready"
});
  await page.goto('https://v0-cmlookup2.vercel.app/members/123456789');

  await expect(communityPageMemberDetail.errorMessage).toHaveText('This member is pending review by account manager. Please wait.');
 await expect(communityPageMemberDetail.errorHeader).toHaveText('Member Not Ready');
});

});


