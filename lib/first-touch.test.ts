import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { describe, test } from 'node:test';
import vm from 'node:vm';
import nextConfig from '../next.config.mjs';
import { FIRST_TOUCH_SRC, firstTouchScriptProps } from './first-touch.ts';
import { consoleUrl, CTA_REF, signupUrl } from './console-url.ts';
import { TAG_MAX, UTM_KEYS } from './utm.ts';

/** The exact file the site serves and the browser runs. */
const FT_JS = readFileSync(new URL(`../public${FIRST_TOUCH_SRC}`, import.meta.url), 'utf8');

/** The version the build inlines (next.config.mjs → process.env.FT_JS_HASH). */
const HASH = nextConfig.env!.FT_JS_HASH!;

/** In-memory sessionStorage stand-in. */
function memoryStorage(initial: Record<string, string> = {}) {
  const items = new Map(Object.entries(initial));
  return {
    getItem: (key: string) => items.get(key) ?? null,
    setItem: (key: string, value: string) => void items.set(key, String(value)),
    items,
  };
}

/** `data-foo-bar` attributes → the element's `dataset` ({ fooBar }). */
function datasetOf(props: Record<string, unknown>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [name, value] of Object.entries(props)) {
    if (name.startsWith('data-')) out[name.slice(5).replace(/-([a-z])/g, (_, c: string) => c.toUpperCase())] = String(value);
  }
  return out;
}

type Listener = { type: string; fn: (e: unknown) => void; capture: unknown };

/**
 * One page load running public/ft.js in a bare VM context that holds only
 * what a page offers it (window, document, URL, URLSearchParams), so any
 * reference outside the file would throw. The script tag carries exactly the
 * attributes the root shell renders.
 */
function loadPage(
  search: string,
  opts: {
    storage?: ReturnType<typeof memoryStorage>;
    storageThrows?: boolean;
    props?: Record<string, unknown>;
    noCurrentScript?: boolean;
  } = {},
) {
  const storage = opts.storage ?? memoryStorage();
  const listeners: Listener[] = [];
  const document = {
    currentScript: opts.noCurrentScript ? null : { dataset: datasetOf(opts.props ?? firstTouchScriptProps(HASH)) },
    addEventListener: (type: string, fn: (e: unknown) => void, capture: unknown) => listeners.push({ type, fn, capture }),
  };
  const window = opts.storageThrows
    ? {
        location: { search },
        get sessionStorage(): never {
          throw new Error('SecurityError');
        },
      }
    : { location: { search }, sessionStorage: storage };
  vm.runInNewContext(FT_JS, { window, document, URL, URLSearchParams }, { filename: 'public/ft.js' });

  /** A link receiving `type` (directly, or through a child element); returns its href afterwards. */
  function use(type: string, initialHref: string, viaChild = false): string {
    let href = initialHref;
    const link = {
      getAttribute: (name: string) => (name === 'href' ? href : null),
      setAttribute: (name: string, value: string) => {
        if (name === 'href') href = value;
      },
      closest: (selector: string) => (selector === 'a[href]' ? link : null),
    };
    const target = viaChild ? { closest: link.closest } : link;
    for (const l of listeners) if (l.type === type) l.fn({ type, target });
    return href;
  }
  const kept = () => {
    const raw = storage.items.get('wg_ft');
    return raw === undefined ? undefined : JSON.parse(raw);
  };
  return { listeners, storage, use, kept };
}

const EVENTS = ['pointerdown', 'focusin', 'click', 'auxclick', 'contextmenu'];
const BLOG_CTA = signupUrl('blog/ship-it');
const SOLO_CTA = signupUrl('pricing', 'pricing-solo', { plan: 'solo' });
const POST_SEARCH = '?utm_source=x&utm_medium=social&utm_campaign=ship-it&utm_content=x-001';
const POST_TOUCH = { utm_source: 'x', utm_medium: 'social', utm_campaign: 'ship-it', utm_content: 'x-001' };
const BLOG_WITH_POST =
  'https://console.whiteghost.ai/signup?ref=blog%2Fship-it&utm_source=x&utm_medium=social&utm_campaign=ship-it&utm_content=x-001';

describe('public/ft.js is plain ES5 that depends on nothing', () => {
  test('no syntax newer than ES5', () => {
    for (const [name, re] of [
      ['arrow function', /=>/],
      ['let', /\blet\b/],
      ['const', /\bconst\b/],
      ['template literal', /`/],
      ['optional chaining', /\?\.[A-Za-z_$[(]/],
      ['nullish coalescing', /\?\?/],
      ['class', /\bclass\b/],
      ['spread / rest', /\.\.\./],
      ['for…of', /\bfor\s*\([^)]*\bof\b/],
      ['async / await', /\basync\s+(function|\()|\bawait\s/],
      ['modules', /\b(import|export|require)\b/],
    ] as const)
      assert.equal(re.test(FT_JS), false, name);
  });
  test('runs in a context with only window, document, URL and URLSearchParams', () => {
    assert.doesNotThrow(() => loadPage(POST_SEARCH));
    assert.doesNotThrow(() => loadPage(''));
  });
});

describe('the script tag', () => {
  test('is async, content-hashed, and carries the whole config from its single sources', () => {
    assert.deepEqual(firstTouchScriptProps(HASH), {
      src: `/ft.js?v=${HASH}`,
      async: true,
      'data-console': consoleUrl(''),
      'data-keys': UTM_KEYS.join(','),
      'data-max': String(TAG_MAX),
    });
  });
  test('the version is the content hash of the file that ships', () => {
    assert.equal(HASH, createHash('sha256').update(FT_JS).digest('hex').slice(0, 16));
  });
  test('/ft.js is served immutable for a year', async () => {
    const rules = await nextConfig.headers!();
    const rule = rules.find((r) => r.source === FIRST_TOUCH_SRC);
    assert.deepEqual(rule?.headers, [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }]);
  });
  test('without the hash the build fails instead of shipping an unversioned immutable src', () => {
    assert.throws(() => firstTouchScriptProps(''), /FT_JS_HASH/);
  });
  test('without its tag or config the script does nothing', () => {
    for (const page of [
      loadPage(POST_SEARCH, { noCurrentScript: true }),
      loadPage(POST_SEARCH, { props: { src: '/ft.js' } }),
      loadPage(POST_SEARCH, { props: { ...firstTouchScriptProps(HASH), 'data-max': '0' } }),
    ]) {
      assert.equal(page.listeners.length, 0);
      assert.equal(page.storage.items.size, 0);
    }
  });
});

describe('capture', () => {
  test('a tagged landing keeps exactly its campaign tags', () => {
    assert.deepEqual(loadPage(POST_SEARCH).kept(), POST_TOUCH);
    assert.deepEqual(loadPage(`${POST_SEARCH}&utm_term=deploy&gclid=abc&ref=zz`).kept(), { ...POST_TOUCH, utm_term: 'deploy' });
  });
  test('no campaign tag → nothing kept', () => {
    for (const search of ['', '?ref=foo&gclid=1', '?utm_source=&utm_medium=%20', '?utm_id=123'])
      assert.equal(loadPage(search).storage.items.size, 0, search);
  });
  test('values are trimmed, stripped of control characters and capped at 100', () => {
    const kept = loadPage(`?utm_source=%20x%0A&utm_campaign=${'a'.repeat(150)}`).kept();
    assert.equal(kept.utm_source, 'x');
    assert.equal(kept.utm_campaign.length, 100);
  });
  test('the cap never splits a surrogate pair', () => {
    assert.equal(loadPage(`?utm_campaign=${'a'.repeat(99)}${encodeURIComponent('😀')}`).kept().utm_campaign, 'a'.repeat(99));
  });
  test('a kept first touch is never replaced', () => {
    const storage = memoryStorage();
    loadPage(POST_SEARCH, { storage });
    const later = loadPage('?utm_source=linkedin&utm_campaign=other', { storage });
    assert.deepEqual(later.kept(), POST_TOUCH);
  });
  test('an untagged load first does not block a later tagged one (same tab)', () => {
    const storage = memoryStorage();
    loadPage('', { storage });
    assert.deepEqual(loadPage(POST_SEARCH, { storage }).kept(), POST_TOUCH);
  });
  test('a malformed kept value is replaced by a real touch', () => {
    const storage = memoryStorage({ wg_ft: '{not json' });
    assert.deepEqual(loadPage(POST_SEARCH, { storage }).kept(), POST_TOUCH);
  });
  test('storage that is blocked or full is harmless', () => {
    assert.doesNotThrow(() => loadPage(POST_SEARCH, { storageThrows: true }));
    const page = loadPage(POST_SEARCH, { storageThrows: true });
    assert.equal(page.use('click', BLOG_CTA), BLOG_CTA);
    const full = memoryStorage();
    full.setItem = () => {
      throw new Error('QuotaExceededError');
    };
    assert.doesNotThrow(() => loadPage(POST_SEARCH, { storage: full }));
  });
});

describe('pass-through', () => {
  test('listens on document, in the capture phase, on every way of using a link', () => {
    const page = loadPage(POST_SEARCH);
    assert.deepEqual(page.listeners.map((l) => l.type), EVENTS);
    assert.ok(page.listeners.every((l) => l.capture === true));
  });
  test('press, keyboard focus, click, middle-click and context menu all hand over the first touch; ref stays', () => {
    const page = loadPage(POST_SEARCH);
    for (const type of EVENTS) assert.equal(page.use(type, BLOG_CTA), BLOG_WITH_POST, type);
    assert.equal(page.use('pointerdown', BLOG_CTA, true), BLOG_WITH_POST, 'pressed on a child of the link');
  });
  test('no first touch → every link stays byte-identical', () => {
    const page = loadPage('');
    for (const type of EVENTS) {
      assert.equal(page.use(type, BLOG_CTA), BLOG_CTA, type);
      assert.equal(page.use(type, SOLO_CTA), SOLO_CTA, type);
    }
  });
  test('a first touch from an earlier page of the same tab is used', () => {
    const storage = memoryStorage();
    loadPage(POST_SEARCH, { storage });
    assert.equal(loadPage('', { storage }).use('click', BLOG_CTA), BLOG_WITH_POST);
  });
  test('a kept value is re-normalized before use (stored values are untrusted)', () => {
    const storage = memoryStorage({ wg_ft: JSON.stringify({ utm_source: ' x ', utm_medium: 42, evil: 'y' }) });
    const out = new URL(loadPage('', { storage }).use('click', BLOG_CTA));
    assert.deepEqual([...out.searchParams], [['ref', 'blog/ship-it'], ['utm_source', 'x']]);
  });
  test('a partial first touch never mixes with the site tags', () => {
    const out = new URL(loadPage('?utm_source=newsletter').use('click', BLOG_CTA));
    assert.deepEqual([...out.searchParams], [['ref', 'blog/ship-it'], ['utm_source', 'newsletter']]);
  });
  test('the Solo button keeps plan=solo (a console intent, not a campaign tag)', () => {
    const out = new URL(loadPage(POST_SEARCH).use('click', SOLO_CTA));
    assert.equal(out.searchParams.get('plan'), 'solo');
    assert.equal(out.searchParams.get('ref'), 'pricing');
    assert.equal(out.searchParams.get('utm_campaign'), 'ship-it');
  });
  test('other parameters (a cross-domain linker id) and the fragment stay', () => {
    const out = new URL(loadPage(POST_SEARCH).use('click', `${BLOG_CTA}&_gl=1*abc*_ga*xyz#top`));
    assert.equal(out.searchParams.get('_gl'), '1*abc*_ga*xyz');
    assert.equal(out.hash, '#top');
    assert.equal(out.searchParams.get('utm_source'), 'x');
  });
  test('the nav and home buttons keep their own ref; only their utm_* give way to the first touch', () => {
    const page = loadPage(POST_SEARCH);
    for (const ref of [CTA_REF.nav, CTA_REF.homeHero, CTA_REF.homeCta, CTA_REF.generic]) {
      for (const type of EVENTS) {
        assert.deepEqual([...new URL(page.use(type, signupUrl(ref))).searchParams], [
          ['ref', ref],
          ['utm_source', 'x'],
          ['utm_medium', 'social'],
          ['utm_campaign', 'ship-it'],
          ['utm_content', 'x-001'],
        ]);
      }
    }
  });
  test('no first touch → the nav and home buttons stay byte-identical, each with its own campaign', () => {
    const page = loadPage('');
    for (const ref of [CTA_REF.nav, CTA_REF.homeHero, CTA_REF.homeCta, CTA_REF.generic]) {
      for (const type of EVENTS) assert.equal(page.use(type, signupUrl(ref)), signupUrl(ref));
      assert.equal(new URL(signupUrl(ref)).searchParams.get('utm_campaign'), ref);
    }
  });
  test('rewriting is idempotent (a second use changes nothing)', () => {
    const page = loadPage(POST_SEARCH);
    assert.equal(page.use('click', page.use('pointerdown', BLOG_CTA)), BLOG_WITH_POST);
  });
  test('sign-in and console-root links get it too (the console records a first touch from any page)', () => {
    const page = loadPage(POST_SEARCH);
    const tags = 'utm_source=x&utm_medium=social&utm_campaign=ship-it&utm_content=x-001';
    assert.equal(page.use('click', consoleUrl('/login')), `${consoleUrl('/login')}?${tags}`);
    assert.equal(page.use('focusin', consoleUrl('/')), `${consoleUrl('/')}?${tags}`);
    assert.equal(page.use('click', consoleUrl('')), `${consoleUrl('/')}?${tags}`);
    assert.equal(page.use('click', consoleUrl('/signup/')), `${consoleUrl('/signup/')}?${tags}`);
    // ref and plan stay, the site tags go
    const out = new URL(page.use('pointerdown', consoleUrl('/login?ref=chrome&plan=solo&utm_source=whiteghost.ai')));
    assert.deepEqual([...out.searchParams], [
      ['ref', 'chrome'],
      ['plan', 'solo'],
      ['utm_source', 'x'],
      ['utm_medium', 'social'],
      ['utm_campaign', 'ship-it'],
      ['utm_content', 'x-001'],
    ]);
  });
  test('no first touch → sign-in and console-root links stay byte-identical', () => {
    const page = loadPage('');
    for (const href of [consoleUrl('/login'), consoleUrl('/login?ref=chrome'), consoleUrl('/'), consoleUrl('')])
      for (const type of EVENTS) assert.equal(page.use(type, href), href, `${type} ${href}`);
  });
  test('other links are never touched', () => {
    const page = loadPage(POST_SEARCH);
    for (const href of [
      consoleUrl('/settings?utm_source=a'),
      consoleUrl('/signupx?utm_source=a'),
      consoleUrl('/login/reset'),
      'https://console.whiteghost.ai.evil.example/signup',
      'https://console.whiteghost.ai:8443/login',
      '/pricing',
      'https://evil.example/https://console.whiteghost.ai/signup',
    ])
      assert.equal(page.use('click', href), href, href);
  });
});
