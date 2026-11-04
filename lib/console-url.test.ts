import assert from 'node:assert/strict';
import { test } from 'node:test';
import { signupUrl } from './console-url.ts';

test('sign-up links render exactly as before', () => {
  assert.equal(
    signupUrl('blog/ship-it'),
    'https://console.whiteghost.ai/signup?ref=blog%2Fship-it&utm_source=whiteghost.ai&utm_medium=cta&utm_campaign=blog%2Fship-it',
  );
  assert.equal(
    signupUrl('pricing', 'pricing-team'),
    'https://console.whiteghost.ai/signup?ref=pricing&utm_source=whiteghost.ai&utm_medium=cta&utm_campaign=pricing-team',
  );
  assert.equal(signupUrl('chrome', 'chrome', {}), signupUrl('chrome'));
});

test('the Solo button adds the console plan intent after the campaign tags', () => {
  assert.equal(
    signupUrl('pricing', 'pricing-solo', { plan: 'solo' }),
    'https://console.whiteghost.ai/signup?ref=pricing&utm_source=whiteghost.ai&utm_medium=cta&utm_campaign=pricing-solo&plan=solo',
  );
});
