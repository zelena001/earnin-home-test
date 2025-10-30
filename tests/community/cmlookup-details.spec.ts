import { test, expect } from '@playwright/test';
import { MemberDetailPage } from '../../pages/MemberDetailPage';

test('verify member details for Jennifer Brown', async ({ page }) => {
  const details = new MemberDetailPage(page);
  await details.gotoByName('Jennifer Brown');
  await details.expectStatuses({
    kyc: 'Verified',
    cashout: 'Enabled',
    account: 'Active'
  });
});
