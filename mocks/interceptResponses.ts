import { Page } from '@playwright/test';

export async function mockCustomMessage(page: Page, id: string, newMessage: string) {
  await page.route('**/members/**' , route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ message: newMessage })
    });
  });
}
