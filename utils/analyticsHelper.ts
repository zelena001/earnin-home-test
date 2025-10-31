import { expect } from '@playwright/test';

/**
 * Verify analytics event structure and property correctness
 * @param event The Segment event payload
 * @param expected A map of property paths to expected values, e.g. 'properties.screenName'
 */
export function verifyAnalyticsEvent(event: any, expected: Record<string, string>) {
  expect(event).toBeTruthy();
  expect(event).toHaveProperty('event'); // top-level event name
  expect(event).toHaveProperty('properties'); // must have properties object

  for (const [path, value] of Object.entries(expected)) {
    const keys = path.split('.'); // support nested paths
    let current: any = event;
    for (const key of keys) {
      expect(current).toHaveProperty(key);
      current = current[key];
    }
    expect(current).toBe(value);
  }
}
