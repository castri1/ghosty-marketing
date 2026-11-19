import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CONSENT_DENIED_REGIONS } from './gtm.ts';

test('consent starts denied in exactly the EU-27, the EEA, the UK and Switzerland (27 + 3 + 2 = 32)', () => {
  const eu27 = [
    'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE',
    'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE',
  ];
  assert.equal(eu27.length, 27);
  assert.equal(CONSENT_DENIED_REGIONS.length, 32);
  assert.equal(new Set(CONSENT_DENIED_REGIONS).size, 32, 'no duplicates');
  assert.deepEqual(
    [...CONSENT_DENIED_REGIONS].sort(),
    [...eu27, 'IS', 'LI', 'NO', 'GB', 'CH'].sort(),
  );
  for (const code of ['GB', 'CH', 'NO', 'IS', 'LI']) assert.ok(CONSENT_DENIED_REGIONS.includes(code as never), code);
  // ISO 3166-1 alpha-2 (Consent Mode's form): 'GB' not 'UK', 'GR' not 'EL'.
  for (const code of CONSENT_DENIED_REGIONS) assert.match(code, /^[A-Z]{2}$/);
  assert.ok(!CONSENT_DENIED_REGIONS.includes('UK' as never));
  assert.ok(!CONSENT_DENIED_REGIONS.includes('EL' as never));
});
