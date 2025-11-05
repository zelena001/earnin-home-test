import { test as base, Page } from '@playwright/test';
import { CommunityPage } from '../pages/CommunityPage';

// Extend the base test to include a "community" fixture
export const test = base.extend<{
  community: CommunityPage;
}>({
  community: async ({ page }, use, testInfo) => {
    // Initialize CommunityPage once per test
    const communityPage = new CommunityPage(page, !!testInfo.project.use.isMobile);
    
    // Navigate to the page before each test
    await communityPage.goto();

     // Give the "community" instance to the test
  await use(communityPage);

  // Teardown (runs AFTER the test) antything from this line is teardown
  console.log('Test finished');
  }
});

export { expect } from '@playwright/test';
