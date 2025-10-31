import { Page } from '@playwright/test';

/**
 * Mock the member API response and replace fallback messages.
 * @param page - Playwright Page object
 * @param memberId - The member ID to intercept
 * @param replacements - An object where keys are original strings and values are replacement strings
 */
export default async function mockMemberFallbackMessages(
  page: Page,
  memberId: string,
  replacements: Record<string, string>
) {
  await page.route(`**/members/${memberId}`, async route => {
    const response = await page.request.fetch(route.request());
    let body = await response.text();

    // Replace all messages
    for (const [original, replacement] of Object.entries(replacements)) {
      body = body.replace(original, replacement);
    }

    await route.fulfill({ response, body });
  });
}
