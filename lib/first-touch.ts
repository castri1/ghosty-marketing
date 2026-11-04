import { consoleUrl } from './console-url.ts';
import { TAG_MAX, UTM_KEYS } from './utm.ts';

/**
 * First-touch campaign pass-through: keeps the campaign tags a visitor landed
 * with (sessionStorage `wg_ft`) and hands them to the console links that can
 * start an account (sign-up, sign-in, the console root) as they are used.
 * The behavior is the hand-written ES5 script `public/ft.js` (its header has
 * the rules); this module only describes its <script> tag, which carries the
 * script's whole config — so the console origin, the kept tags and the
 * length bound have one source each (lib/console-url.ts, lib/utm.ts).
 *
 * The tag is `async` (never blocks rendering; it still runs before the page
 * hydrates in practice, and `document.currentScript` works for an async
 * classic script) and its src carries the file's content hash
 * (`?v=<FT_JS_HASH>`, computed by next.config.mjs at build time), which is
 * what lets `/ft.js` be served immutable for a year.
 * components/wg/RootShell.tsx renders it; lib/first-touch.test.ts runs
 * public/ft.js with exactly these attributes.
 */

/** Where the script is served from (a static public asset). */
export const FIRST_TOUCH_SRC = '/ft.js';

/** The <script> tag's attributes. `version` is the content hash of public/ft.js. */
export function firstTouchScriptProps(version: string | undefined = process.env.FT_JS_HASH) {
  // Without the hash the src would be unversioned and, being immutable, stale
  // for a year after any change: fail the build instead.
  if (!version) throw new Error('FT_JS_HASH is not set: next.config.mjs computes it from public/ft.js');
  return {
    src: `${FIRST_TOUCH_SRC}?v=${version}`,
    async: true,
    'data-console': consoleUrl(''),
    'data-keys': UTM_KEYS.join(','),
    'data-max': String(TAG_MAX),
  };
}
