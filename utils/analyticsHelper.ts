import { expect } from '@playwright/test';

/**
 * Verify analytics event structure and property correctness
 * @param event The Segment event payload
 * @param expected A map of property paths to expected values, e.g. 'properties.screenName'
 */
export function verifyAnalyticsEvent(event: any, expected: Record<string, string>) {
  if (!event) {
    console.error('❌ Event is undefined or null. Cannot validate.');
    throw new Error('Analytics event is missing!');
  }

  if (!event.properties) {
    console.error('❌ Event exists but missing "properties" object.');
    console.error('Full event payload:', JSON.stringify(event, null, 2));
    throw new Error('Analytics event properties missing!');
  }

  // Top-level checks
  expect(event).toHaveProperty('event');
  expect(event).toHaveProperty('properties');

  for (const [path, value] of Object.entries(expected)) {
    const keys = path.split('.'); // support nested paths
    let current: any = event;

    try {
      for (const key of keys) {
        expect(current).toHaveProperty(key);
        current = current[key];
      }
      expect(current).toBe(value);
    } catch (err) {
      console.error(`❌ Validation failed for path "${path}". Expected: "${value}", Actual: "${current}"`);
      console.error('Full event payload:', JSON.stringify(event, null, 2));
      throw err;
    }
  }
}
