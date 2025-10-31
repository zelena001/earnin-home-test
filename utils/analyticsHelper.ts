import { expect } from '@playwright/test';

/**
 * Verify analytics event structure and property correctness
 */
export function verifyAnalyticsEvent(event: any, expected: Record<string, string>) {
  expect(event).toBeTruthy();
  expect(event).toHaveProperty('eventName');
  expect(event).toHaveProperty('elementName');
  expect(event).toHaveProperty('component');

  // Check that required fields match expected
  for (const [key, value] of Object.entries(expected)) {
    expect(event[key]).toBe(value);
  }
}
