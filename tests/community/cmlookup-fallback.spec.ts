import { test, expect } from '@playwright/test';
import { MemberDetailPage } from '../../pages/MemberDetailPage';

test('handles non-existent member gracefully', async ({ page }) => {
  const details = new MemberDetailPage(page);
  await details.gotoById('123456789');
  await expect(details.notFoundMessage).toHaveText(
    "The member you're looking for doesn't exist or has been removed."
  );
});
