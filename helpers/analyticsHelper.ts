import { Page, expect } from '@playwright/test';

/**
 * Verify analytics event structure and property correctness.
 *
 * @param event - The Segment event payload object to validate.
 * @param expected - A map of property paths to expected values.
 *                   Nested properties can be specified with dot notation.
 *                   Example: { 'properties.screenName': 'Budget Calculator' }
 * @throws Will throw an error if the event is missing, properties are missing,
 *         or any property value does not match the expected value.
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

/**
 * Capture all Segment analytics events emitted during page interactions.
 *
 * @param page - The Playwright Page object.
 * @returns An array of captured analytics event objects.
 *          Each object represents a POST request to Segment's tracking API.
 */
export function captureSegmentEvents(page: Page) {
  const analyticsEvents: any[] = [];

  const listener = async (req: any) => {
    if (req.url().includes('https://api.segment.io/v1/t') && req.method() === 'POST') {
      try {
        const data = req.postDataJSON();
        analyticsEvents.push(data);
        console.log('📊 [Segment Event Captured] Event:', data.event);
      } catch (err) {
        console.warn('⚠️ Failed to parse Segment request', err);
      }
    }
  };

  page.on('request', listener);

  return {
    analyticsEvents,
    cleanup: () => page.removeListener('request', listener), // remove the listener when done
  };
}

/**
 * Verify that a specific analytics event was triggered within a given timeout.
 * Polls the captured events repeatedly until a matching event is found or the timeout is reached.
 *
 * @param events - Array of captured analytics events.
 * @param expected - Map of property paths to expected values for the event.
 *                   Nested properties can be specified using dot notation.
 *                   Example: { event: 'User interacted with element', 'properties.elementName': 'Income' }
 * @param options - Optional configuration object:
 *                  - timeout: maximum time to wait for the event (in ms, default 3000)
 *                  - interval: polling interval between checks (in ms, default 200)
 * @returns The matched analytics event object.
 * @throws Will throw an error if the event is not found within the timeout.
 */
export async function verifyAnalyticsEventTrigger(
  events: any[],
  expected: Record<string, any>,
  options: { timeout?: number; interval?: number } = {}
): Promise<any> {
  const timeout = options.timeout ?? 3000; // default max wait 3s
  const interval = options.interval ?? 200; // default polling every 200ms
  const start = Date.now();

  let matched: any;

  while (Date.now() - start < timeout) {
    matched = events.find((e) =>
      Object.entries(expected).every(([key, value]) => {
        const actual = key.split('.').reduce((obj, prop) => obj?.[prop], e);
        return actual === value;
      })
    );

    if (matched) break; // found the event

    // wait a bit before next check
    await new Promise((r) => setTimeout(r, interval));
  }

  expect(matched, `❌ Event not found with expected properties: ${JSON.stringify(expected, null, 2)}`)
    .toBeTruthy();

  console.log(`✅ Found event: "${matched.event}"`);
  return matched;
}
