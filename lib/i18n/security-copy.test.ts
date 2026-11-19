import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { en } from './en.ts';
import { es } from './es.ts';

/**
 * /security restates facts that other pages own: the Enterprise items come
 * from /pricing and the service providers from /privacy. These checks keep
 * the restatement from drifting away from its source.
 */

test('the Enterprise items on /security are verbatim Enterprise features on /pricing', () => {
  for (const dict of [en, es]) {
    const enterprise = dict.pricing.tiers.find((tier) => tier.id === 'enterprise');
    assert.ok(enterprise, 'pricing has an Enterprise tier');
    for (const item of dict.security.enterprise.items) {
      assert.ok(enterprise.features.includes(item), `"${item}" is an Enterprise feature on /pricing`);
    }
  }
});

test('every named service provider on /security is named by the Privacy Policy', () => {
  const privacy = readFileSync(
    new URL('../../app/(en)/(content)/privacy/page.tsx', import.meta.url),
    'utf8',
  );
  // The first entry is the hosting provider, described rather than named.
  const named = en.security.providers.items.slice(1).map((item) => item.name);
  for (const name of named) {
    for (const part of name.split(' with ')) {
      assert.ok(privacy.includes(part), `/privacy names ${part}`);
    }
  }
  assert.deepEqual(
    es.security.providers.items.slice(1).map((item) => item.name.replace(' con ', ' with ')),
    named,
    'the Spanish list names the same providers in the same order',
  );
});
