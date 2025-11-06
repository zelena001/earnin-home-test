import { test as base, Page } from '@playwright/test';
import { CommunityPage } from '../pages/CommunityPage';

export const test = base.extend<{
  community: CommunityPage;
}>({
  community: async ({ page }, use, testInfo) => {
    // Initialize CommunityPage once per test
    const communityPage = new CommunityPage(page, !!testInfo.project.use.isMobile);

    // Do NOT navigate here
    await use(communityPage);

    // Teardown (runs AFTER the test)
    console.log('Community test finished');
  }
});

export { expect } from '@playwright/test';
