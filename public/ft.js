/*
 * White Ghost first-touch pass-through.
 *
 * A visitor who lands with campaign tags (utm_*) keeps them for the rest of
 * the tab's visit, and the console link they finally use to get an account
 * (sign-up, sign-in or the console root: the console records the first touch
 * from any of them) carries those tags instead of the site's own
 * utm_source=whiteghost.ai&utm_medium=cta.
 *
 * - Capture, as the page loads: the URL carries a campaign tag and the tab
 *   has none kept yet, so the tags go to sessionStorage "wg_ft". A kept touch
 *   is never replaced. Session storage only: no cookie, nothing across
 *   sessions.
 * - Pass-through: when one of those console links is about to be used
 *   (pressed, keyboard-focused, clicked, middle-clicked, right-clicked) its
 *   utm_* are replaced by the kept ones; every other parameter (ref, plan)
 *   stays. With nothing kept, a link is never touched.
 *
 * Hand-written ES5 with no dependencies, served as is from /ft.js?v=<hash>
 * and loaded async in <head> by components/wg/RootShell.tsx: it never blocks
 * rendering and still captures and listens before the page hydrates in
 * practice. Its whole config comes from the script
 * tag (lib/first-touch.ts): data-console (console origin), data-keys (the
 * kept tags, comma-separated), data-max (longest kept value). The tests in
 * lib/first-touch.test.ts run this exact file.
 */
(function () {
  'use strict';

  var script = document.currentScript;
  if (!script || !script.dataset) return;
  if (typeof URL !== 'function' || typeof URLSearchParams !== 'function') return;

  var CONSOLE = script.dataset.console || '';
  var KEYS = (script.dataset.keys || '').split(',');
  var MAX = parseInt(script.dataset.max, 10);
  if (!CONSOLE || !KEYS[0] || !(MAX > 0)) return;

  /* Console pages that can start an account (trailing slash optional). */
  var ENTRY_PATHS = ['/', '/signup', '/login'];
  var STORAGE_KEY = 'wg_ft';
  var EVENTS = ['pointerdown', 'focusin', 'click', 'auxclick', 'contextmenu'];

  /* One tag value: control characters out, trimmed, capped; '' = none. */
  function clean(raw) {
    if (typeof raw !== 'string') return '';
    var value = raw.replace(/[\u0000-\u001f\u007f]/g, '').trim().slice(0, MAX);
    /* The cap must not split a surrogate pair. */
    if (/[\uD800-\uDBFF]$/.test(value)) value = value.slice(0, -1);
    return value;
  }

  /* The kept tags of a record; null when it has none. */
  function pick(get) {
    var touch = {};
    var any = false;
    for (var i = 0; i < KEYS.length; i++) {
      var value = clean(get(KEYS[i]));
      if (value) {
        touch[KEYS[i]] = value;
        any = true;
      }
    }
    return any ? touch : null;
  }

  /* The tab's kept first touch, re-normalized (stored values are untrusted). */
  function read(storage) {
    if (!storage) return null;
    try {
      var raw = storage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) return null;
      return pick(function (key) {
        return parsed[key];
      });
    } catch (e) {
      return null;
    }
  }

  /* A console entry page (sign-up, sign-in, root), optionally with a query or fragment. */
  function isEntry(href) {
    if (href.indexOf(CONSOLE) !== 0) return false;
    var rest = href.slice(CONSOLE.length);
    var first = rest.charAt(0);
    if (rest !== '' && first !== '/' && first !== '?' && first !== '#') return false;
    var path = rest.split(/[?#]/)[0];
    if (path.length > 1 && path.charAt(path.length - 1) === '/') path = path.slice(0, -1);
    return ENTRY_PATHS.indexOf(path || '/') !== -1;
  }

  /*
   * The address with the first touch's tags: every utm_* on the link is
   * replaced (a mix of the post's tags and the button's would misattribute);
   * every other parameter and the fragment stay.
   */
  function rewrite(href, touch) {
    var url;
    try {
      url = new URL(href);
    } catch (e) {
      return href;
    }
    var present = [];
    url.searchParams.forEach(function (value, key) {
      if (key.indexOf('utm_') === 0 && present.indexOf(key) === -1) present.push(key);
    });
    for (var i = 0; i < present.length; i++) url.searchParams.delete(present[i]);
    for (var j = 0; j < KEYS.length; j++) {
      if (touch[KEYS[j]]) url.searchParams.set(KEYS[j], touch[KEYS[j]]);
    }
    return url.toString();
  }

  var storage = null;
  try {
    storage = window.sessionStorage;
  } catch (e) {
    storage = null;
  }

  /* Capture: this load is tagged and the tab has nothing kept yet. */
  if (storage) {
    var params = new URLSearchParams(window.location.search);
    var landed = pick(function (key) {
      return params.get(key);
    });
    if (landed && read(storage) === null) {
      try {
        storage.setItem(STORAGE_KEY, JSON.stringify(landed));
      } catch (e) {
        /* storage full or blocked: links keep the site's own tags */
      }
    }
  }

  /* Pass-through, in the capture phase, before the browser follows the link. */
  function onUse(event) {
    var target = event.target;
    if (!target || typeof target.closest !== 'function') return;
    var link = target.closest('a[href]');
    if (!link) return;
    var href = link.getAttribute('href') || '';
    if (!isEntry(href)) return;
    var touch = read(storage);
    if (!touch) return;
    var next = rewrite(href, touch);
    if (next !== href) link.setAttribute('href', next);
  }

  for (var k = 0; k < EVENTS.length; k++) document.addEventListener(EVENTS[k], onUse, true);
})();
