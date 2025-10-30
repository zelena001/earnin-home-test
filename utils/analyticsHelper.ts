import { expect } from '@playwright/test';

export function validateEventSchema(event: any) {
  const required = ['event', 'elementName', 'component', 'values'];
  for (const prop of required) {
    expect(event, Missing property: ).toHaveProperty(prop);
  }
}
