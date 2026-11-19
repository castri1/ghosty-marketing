import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CTA_REF, signupUrl } from './console-url.ts';

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

test('nav, home hero and home closing CTA each carry their own ref and campaign', () => {
  assert.equal(
    signupUrl(CTA_REF.nav),
    'https://console.whiteghost.ai/signup?ref=nav&utm_source=whiteghost.ai&utm_medium=cta&utm_campaign=nav',
  );
  assert.equal(
    signupUrl(CTA_REF.homeHero),
    'https://console.whiteghost.ai/signup?ref=home-hero&utm_source=whiteghost.ai&utm_medium=cta&utm_campaign=home-hero',
  );
  assert.equal(
    signupUrl(CTA_REF.homeCta),
    'https://console.whiteghost.ai/signup?ref=home-cta&utm_source=whiteghost.ai&utm_medium=cta&utm_campaign=home-cta',
  );
  // distinct from each other, from the generic `chrome` and from the creator block
  const refs = [...Object.values(CTA_REF), 'chrome', 'home-creator'];
  assert.equal(new Set(refs).size, refs.length);
});

test('the Solo button adds the console plan intent after the campaign tags', () => {
  assert.equal(
    signupUrl('pricing', 'pricing-solo', { plan: 'solo' }),
    'https://console.whiteghost.ai/signup?ref=pricing&utm_source=whiteghost.ai&utm_medium=cta&utm_campaign=pricing-solo&plan=solo',
  );
});
