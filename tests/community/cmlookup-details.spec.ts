import { test, expect } from '@playwright/test';
import { CommunityPage } from '../../pages/CommunityPage';
import memberDataJson from '../../testdata/memberData.json';
import { Member } from '../../interfaces/communityMember.ts';
import { CommunityPageMemberDetail } from '../../pages/CommunityPageMemberDetail';

test.describe.only('Community Member Detail screen', () => {
const Jennifer: Member = memberDataJson.member.Jennifer.info;
  test('C', async ({ page }, testInfo) => {
    const community = new CommunityPage(page,  testInfo.project.name);
    await community.goto();
await community.clickElementByText(Jennifer.name);
const memberDetail = new CommunityPageMemberDetail(page);
await memberDetail.verifyMemberInfo(Jennifer);


  });

});


