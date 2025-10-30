import { test, expect } from '@playwright/test';
import { CommunityPage } from '../../pages/CommunityPage';

test.describe('Community Member Lookup', () => {
  test('filters by Active account status', async ({ page }) => {
    const community = new CommunityPage(page);
    await community.goto();
    await community.filterByStatus('Active');
    const count = await community.getVisibleCount();
    expect(count).toBeGreaterThan(0);
  });
});
