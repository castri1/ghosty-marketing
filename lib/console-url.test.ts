import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
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

test('each sign-up button has its own ref and campaign; the generic one is still chrome', () => {
  const base = 'https://console.whiteghost.ai/signup?utm_source=whiteghost.ai&utm_medium=cta';
  const link = (ref: string) => base.replace('?', `?ref=${ref}&`) + `&utm_campaign=${ref}`;
  assert.equal(signupUrl(CTA_REF.nav), link('nav'));
  assert.equal(signupUrl(CTA_REF.homeHero), link('home-hero'));
  assert.equal(signupUrl(CTA_REF.homeCta), link('home-cta'));
  assert.equal(signupUrl(CTA_REF.generic), link('chrome'));
  const refs = [...Object.values(CTA_REF), 'home-creator'];
  assert.equal(new Set(refs).size, refs.length);
});

test('the nav and home buttons render their own ref (the same component serves every locale)', () => {
  const src = (file: string) => readFileSync(new URL(`../components/wg/${file}`, import.meta.url), 'utf8');
  const uses = (file: string, call: string) => src(file).split(call).length - 1;
  assert.equal(uses('AltHero.tsx', 'signupUrl(CTA_REF.homeHero)'), 1);
  assert.equal(uses('AltCTA.tsx', 'signupUrl(CTA_REF.homeCta)'), 1);
  assert.equal(uses('AltNav.tsx', 'signupUrl(CTA_REF.nav)'), 2); // desktop button + mobile menu
  assert.equal(uses('AltCreator.tsx', 'signupUrl("home-creator")'), 1);
  for (const file of ['AltHero.tsx', 'AltCTA.tsx', 'AltNav.tsx'])
    assert.equal(src(file).includes('"/waitlist"'), false, `${file} still renders the generic link`);
});

test('the Solo button adds the console plan intent after the campaign tags', () => {
  assert.equal(
    signupUrl('pricing', 'pricing-solo', { plan: 'solo' }),
    'https://console.whiteghost.ai/signup?ref=pricing&utm_source=whiteghost.ai&utm_medium=cta&utm_campaign=pricing-solo&plan=solo',
  );
});
