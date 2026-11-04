import assert from 'node:assert/strict';
import { describe, test } from 'node:test';
import {
  LinkInputSchema,
  dayKey,
  isBotUserAgent,
  isGoPath,
  isLinkId,
  isSpeculativeLoad,
  linkConfig,
  newLinkDoc,
  readStoredLink,
  settleWithin,
  shouldCountClick,
  withUtms,
} from './links.ts';

const CHROME_MAC =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36';
const SAFARI_IPHONE =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.1 Mobile/15E148 Safari/604.1';
const X_IN_APP =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 Twitter for iPhone/10.70';
/** A CUBOT phone: "CUBOT" ends in "bot", and it is a person on Chrome Mobile. */
const CUBOT_CHROME =
  'Mozilla/5.0 (Linux; Android 10; CUBOT X30) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36';
const CUBOT_UNDERSCORE =
  'Mozilla/5.0 (Linux; Android 9; CUBOT_X19) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.6099.230 Mobile Safari/537.36';
const CUBOT_BUILD =
  'Mozilla/5.0 (Linux; Android 10; CUBOT P40 Build/QP1A.190711.020; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/120.0.6099.230 Mobile Safari/537.36';
const LINKEDIN_IN_APP =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 18_1 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [LinkedInApp]/9.30.1';

function headers(init: Record<string, string>): Headers {
  return new Headers(init);
}

describe('isLinkId', () => {
  test('accepts channel prefix + 3 or more digits', () => {
    for (const id of ['x-001', 'li-002', 'yt-003', 'x-1234', 'li-000']) assert.equal(isLinkId(id), true, id);
  });
  test('rejects everything else', () => {
    for (const id of ['', 'x-01', 'x-1', 'X-001', 'tw-001', 'x001', 'x-001a', 'x-001/', ' x-001', 'yt-abc', 'x-00١', 'li-001\n'])
      assert.equal(isLinkId(id), false, JSON.stringify(id));
  });
});

describe('isBotUserAgent', () => {
  test('named unfurlers and crawlers', () => {
    for (const ua of [
      'Twitterbot/1.0',
      'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
      'facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)',
      'Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)',
      'Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)',
      'WhatsApp/2.23.20.0',
      'TelegramBot (like TwitterBot)',
      'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
      'Mozilla/5.0 (compatible; bingbot/2.0; +http://www.bing.com/bingbot.htm)',
    ])
      assert.equal(isBotUserAgent(ua), true, ua);
  });
  test('every link-preview / card fetcher is never counted, contact URL or not', () => {
    for (const ua of [
      'Twitterbot/1.0',
      'LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +http://www.linkedin.com)',
      'facebookexternalhit/1.1',
      'Mozilla/5.0 (compatible; Facebot)',
      'Slackbot-LinkExpanding 1.0',
      'Slackbot 1.0',
      'Discordbot/2.0',
      'WhatsApp/2.23.20.0',
      'TelegramBot (like TwitterBot)',
      'Pinterest/0.2',
      'Pinterest/0.2 (+http://www.pinterest.com/bot.html)',
      'Mozilla/5.0 (compatible; Pinterestbot/1.0; +http://www.pinterest.com/bot.html)',
      'Mozilla/5.0 (compatible; redditbot/1.0; +http://www.reddit.com/feedback)',
      'Mozilla/5.0 (compatible; Bluesky Cardyb/1.1; +mailto:support@bsky.app)',
      'Cardyb/1.1',
      'http.rb/5.2.0 (Mastodon/4.3.0; +https://mastodon.social/)',
      'http.rb/5.2.0 (Mastodon/4.3.0)',
      'Iframely/1.3.1 (+https://iframely.com/docs/about) Atlas',
      'Iframely/1.3.1',
      'Mozilla/5.0 (compatible; Embedly/0.2; +http://support.embed.ly/)',
      'Embedly/0.2',
    ])
      assert.equal(shouldCountClick('GET', headers({ 'user-agent': ua })), false, ua);
  });
  test("Pinterest's in-app browser is a person (only its fetchers are not)", () => {
    for (const ua of [
      'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148 [Pinterest/iOS]',
      'Mozilla/5.0 (Linux; Android 14; Pixel 8 Build/AP2A.240805.005; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/127.0.6533.103 Mobile Safari/537.36 [Pinterest/Android]',
    ])
      assert.equal(shouldCountClick('GET', headers({ 'user-agent': ua })), true, ua);
  });
  test('any other "…bot" product token, any case', () => {
    for (const ua of [
      'SomeBOT/1',
      'Mozilla/5.0 (compatible; PetalBot;+https://webmaster.petalsearch.com/site/petalbot)',
      'Mozilla/5.0 (compatible; YandexBot/3.0; +http://yandex.com/bots)',
      'DuckDuckBot-Https/1.1; (+https://duckduckgo.com/duckduckbot)',
      'Mozilla/5.0 (compatible; acmebot)',
      'acmebot (like Googlebot)',
      'acmebot',
      // a digit or `_` before "bot" is still a bot token
      'Mozilla/5.0 (compatible; MJ12bot/v1.4.8; http://mj12bot.com/)',
      'Mail.RU_Bot/2.0',
    ])
      assert.equal(isBotUserAgent(ua), true, ua);
  });
  test('a "+http(s)://" contact URL marks a crawler or fetcher', () => {
    for (const ua of [
      'Mozilla/5.0 (compatible; Linux x86_64; Mail.RU_Bot/2.0; +https://help.mail.ru/webmaster/indexing/robots)',
      'SomeFetcher/3.1 (+http://example.com/about)',
      'Mozilla/5.0 (compatible; Acme/1.0; +https://acme.example/crawling)',
    ])
      assert.equal(isBotUserAgent(ua), true, ua);
  });
  test('"bot" inside a device model is not a bot (CUBOT phones are people)', () => {
    for (const ua of [CUBOT_CHROME, CUBOT_UNDERSCORE, CUBOT_BUILD]) assert.equal(isBotUserAgent(ua), false, ua);
    assert.equal(shouldCountClick('GET', headers({ 'user-agent': CUBOT_CHROME })), true);
  });
  test('crawler / spider / preview words, any case', () => {
    for (const ua of ['acme-crawler', 'Spider 2', 'Mozilla/5.0 SkypeUriPreview Preview/0.5'])
      assert.equal(isBotUserAgent(ua), true, ua);
  });
  test('scripts and headless browsers', () => {
    for (const ua of [
      'curl/8.7.1',
      'Wget/1.21',
      'python-requests/2.32',
      'Go-http-client/2.0',
      'node-fetch/1.0',
      'undici',
      'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) HeadlessChrome/130.0.0.0 Safari/537.36',
    ])
      assert.equal(isBotUserAgent(ua), true, ua);
  });
  test('a missing or blank user agent is not a person', () => {
    assert.equal(isBotUserAgent(null), true);
    assert.equal(isBotUserAgent(undefined), true);
    assert.equal(isBotUserAgent('  '), true);
  });
  test('browsers and in-app browsers are people', () => {
    for (const ua of [CHROME_MAC, SAFARI_IPHONE, X_IN_APP, LINKEDIN_IN_APP]) assert.equal(isBotUserAgent(ua), false, ua);
  });
});

describe('shouldCountClick', () => {
  test('a browser GET counts', () => {
    assert.equal(shouldCountClick('GET', headers({ 'user-agent': CHROME_MAC })), true);
    assert.equal(shouldCountClick('get', headers({ 'user-agent': X_IN_APP })), true);
  });
  test('HEAD never counts, even from a browser', () => {
    assert.equal(shouldCountClick('HEAD', headers({ 'user-agent': CHROME_MAC })), false);
  });
  test('other methods never count', () => {
    assert.equal(shouldCountClick('POST', headers({ 'user-agent': CHROME_MAC })), false);
  });
  test('a bot GET does not count', () => {
    assert.equal(shouldCountClick('GET', headers({ 'user-agent': 'Twitterbot/1.0' })), false);
    assert.equal(shouldCountClick('GET', headers({})), false);
  });
  test('speculative loads do not count', () => {
    assert.equal(shouldCountClick('GET', headers({ 'user-agent': CHROME_MAC, 'sec-purpose': 'prefetch;prerender' })), false);
    assert.equal(shouldCountClick('GET', headers({ 'user-agent': CHROME_MAC, purpose: 'prefetch' })), false);
    assert.equal(shouldCountClick('GET', headers({ 'user-agent': SAFARI_IPHONE, 'x-purpose': 'preview' })), false);
    assert.equal(isSpeculativeLoad(headers({ 'sec-purpose': 'nothing' })), false);
  });
});

describe('isGoPath (the sitemap guard)', () => {
  test('a path under /go/ is a tracked link; nothing else is', () => {
    assert.equal(isGoPath('/go/x-001'), true);
    for (const path of ['/', '/go', '/good', '/blog/go/x-001', '/docs/go'])
      assert.equal(isGoPath(path), false, path);
  });
});

describe('settleWithin', () => {
  test('true when the work fulfills in time', async () => {
    assert.equal(await settleWithin(Promise.resolve('ok'), 50), true);
  });
  test('owns no error handling: a rejection in time propagates to the caller', async () => {
    await assert.rejects(settleWithin(Promise.reject(new Error('store down')), 50), /store down/);
  });
  test('false once the wait gives up; never waits on slow work', async () => {
    const started = Date.now();
    const slow = new Promise((resolve) => setTimeout(resolve, 1000));
    assert.equal(await settleWithin(slow, 30), false);
    assert.ok(Date.now() - started < 500, 'returned near the bound, not after the work');
  });
});

describe('dayKey', () => {
  test('is the UTC calendar day', () => {
    assert.equal(dayKey(new Date('2026-11-04T23:59:59.999Z')), '2026-11-04');
    assert.equal(dayKey(new Date('2026-11-05T00:00:00.000Z')), '2026-11-05');
    // 20:00 in Bogotá (UTC-5) is already the next UTC day.
    assert.equal(dayKey(new Date('2026-11-04T20:00:00-05:00')), '2026-11-05');
  });
});

describe('withUtms', () => {
  const tags = { utm_source: 'x', utm_medium: 'social', utm_campaign: 'ship-it', utm_content: 'x-001' };

  test('appends the tags to a bare target', () => {
    assert.equal(
      withUtms('https://whiteghost.ai/', tags),
      'https://whiteghost.ai/?utm_source=x&utm_medium=social&utm_campaign=ship-it&utm_content=x-001',
    );
  });
  test('keeps existing parameters and the fragment; replaces a tag already on the target', () => {
    assert.equal(
      withUtms('https://whiteghost.ai/blog/post?lang=es&utm_source=old#faq', tags),
      'https://whiteghost.ai/blog/post?lang=es&utm_source=x&utm_medium=social&utm_campaign=ship-it&utm_content=x-001#faq',
    );
  });
  test('encodes values', () => {
    assert.equal(
      withUtms('https://whiteghost.ai/', { utm_source: 'x', utm_campaign: 'a b&c' }),
      'https://whiteghost.ai/?utm_source=x&utm_campaign=a+b%26c',
    );
  });
  test('skips missing, empty and non-string tags (stored docs are untyped)', () => {
    assert.equal(
      withUtms('https://whiteghost.ai/', { utm_source: 'x', utm_medium: '', utm_campaign: 7 as unknown as string }),
      'https://whiteghost.ai/?utm_source=x',
    );
  });
  test('only https targets', () => {
    assert.equal(withUtms('http://whiteghost.ai/', tags), null);
    assert.equal(withUtms('javascript:alert(1)', tags), null);
    assert.equal(withUtms('/relative', tags), null);
    assert.equal(withUtms('', tags), null);
  });
});

describe('LinkInputSchema', () => {
  const ok = {
    target: 'https://whiteghost.ai/blog/ship-it',
    utm_source: 'x',
    utm_medium: 'social',
    utm_campaign: 'ship-it',
  };

  test('accepts a minimal body; utm_content defaults to the id', () => {
    const parsed = LinkInputSchema.parse(ok);
    assert.deepEqual(linkConfig('x-001', parsed), { ...ok, utm_content: 'x-001' });
    assert.deepEqual(linkConfig('x-001', LinkInputSchema.parse({ ...ok, utm_content: 'hero' })).utm_content, 'hero');
  });
  test('on update an omitted utm_content keeps the stored value; a sent one replaces it', () => {
    const stored = { utm_content: 'hero' };
    assert.equal(linkConfig('x-001', LinkInputSchema.parse(ok), stored).utm_content, 'hero');
    assert.equal(linkConfig('x-001', LinkInputSchema.parse({ ...ok, utm_content: 'footer' }), stored).utm_content, 'footer');
    // a stored doc without one (never written by this API) falls back to the id
    assert.equal(linkConfig('x-001', LinkInputSchema.parse(ok), { utm_content: '' }).utm_content, 'x-001');
    assert.equal(linkConfig('x-001', LinkInputSchema.parse(ok), null).utm_content, 'x-001');
  });
  test('is strict: server-managed and unknown fields are rejected', () => {
    for (const extra of [{ clicks: 5 }, { clicks_by_day: {} }, { createdAt: 'x' }, { utm_term: 'x' }, { tagret: 'x' }])
      assert.equal(LinkInputSchema.safeParse({ ...ok, ...extra }).success, false, JSON.stringify(extra));
  });
  test('requires source, medium and campaign', () => {
    for (const key of ['target', 'utm_source', 'utm_medium', 'utm_campaign'] as const) {
      const body: Record<string, string> = { ...ok };
      delete body[key];
      assert.equal(LinkInputSchema.safeParse(body).success, false, key);
    }
  });
  test('target must be an absolute https address without credentials', () => {
    for (const target of ['http://whiteghost.ai/', '/blog', 'whiteghost.ai', 'javascript:alert(1)', 'https://u:p@whiteghost.ai/', ''])
      assert.equal(LinkInputSchema.safeParse({ ...ok, target }).success, false, target);
    assert.equal(LinkInputSchema.safeParse({ ...ok, target: 'https://console.whiteghost.ai/signup' }).success, true);
  });
  test('says what is wrong (explicit messages, not the bundle-dependent defaults)', () => {
    const messages = (body: unknown) => {
      const parsed = LinkInputSchema.safeParse(body);
      assert.equal(parsed.success, false);
      return parsed.error!.issues.map((i) => `${i.path.join('.')}: ${i.message}`).sort();
    };
    assert.deepEqual(messages({ target: 'https://whiteghost.ai/', utm_source: 'x', utm_medium: 'social', clicks: 3 }), [
      ': unknown field(s): clicks',
      'utm_campaign: required',
    ]);
    assert.deepEqual(messages([]), [': body must be a JSON object']);
    assert.deepEqual(messages({ ...ok, utm_source: 5, target: 'http://x.y/' }), [
      'target: an absolute https:// address',
      'utm_source: must be a string',
    ]);
  });
  test('tag values: 1–100 characters, no control characters, no surrounding spaces', () => {
    for (const utm_campaign of ['', 'a'.repeat(101), 'bad\nvalue', ' padded', 'padded '])
      assert.equal(LinkInputSchema.safeParse({ ...ok, utm_campaign }).success, false, JSON.stringify(utm_campaign));
    assert.equal(LinkInputSchema.safeParse({ ...ok, utm_campaign: 'a'.repeat(100) }).success, true);
  });
});

describe('stored documents', () => {
  test('a new link starts with zero clicks and an empty day map (maps, never arrays)', () => {
    const doc = newLinkDoc(linkConfig('li-002', LinkInputSchema.parse({
      target: 'https://whiteghost.ai/',
      utm_source: 'linkedin',
      utm_medium: 'social',
      utm_campaign: 'launch',
    })), new Date('2026-11-04T12:00:00Z'));
    assert.deepEqual(doc, {
      target: 'https://whiteghost.ai/',
      utm_source: 'linkedin',
      utm_medium: 'social',
      utm_campaign: 'launch',
      utm_content: 'li-002',
      clicks: 0,
      clicks_by_day: {},
      createdAt: '2026-11-04T12:00:00.000Z',
      updatedAt: '2026-11-04T12:00:00.000Z',
    });
    assert.equal(Object.values(doc).some(Array.isArray), false);
  });
  test('read-back keeps known fields, defaults counters, drops junk day values', () => {
    const link = readStoredLink({
      target: 'https://whiteghost.ai/',
      utm_source: 'x',
      utm_medium: 'social',
      utm_campaign: 'c',
      utm_content: 'x-001',
      clicks_by_day: { '2026-11-04': 3, '2026-11-05': 'nope' },
      secret: 'never echoed',
    });
    assert.equal(link.clicks, 0);
    assert.deepEqual(link.clicks_by_day, { '2026-11-04': 3 });
    assert.equal('secret' in link, false);
  });
});
