import { z } from 'zod';
import { LINK_UTM_KEYS, TAG_MAX, type LinkUtmKey } from './utm.ts';

/**
 * Tracked short links: `/go/<id>` (app/go/[id]/route.ts) redirects to a
 * stored target with the link's campaign tags appended and counts real
 * clicks; `/api/links/<id>` (bearer `MARKETING_CONTENT_TOKEN`) creates and
 * reads them. Links are NOT a content type — lib/content-types.ts drives the
 * public surfaces (sitemap, llms.txt, RSS, raw markdown, the public content
 * API) and a link must never reach any of them.
 *
 * Everything here is pure (zod and lib/utm.ts are the only imports) so
 * `node --test` runs it natively; the store calls live in the route handlers.
 *
 * Store shape (`marketing_links/{id}`), maps only — never nested arrays:
 *   { target, utm_source, utm_medium, utm_campaign, utm_content,
 *     clicks, clicks_by_day: { 'YYYY-MM-DD': n }, createdAt, updatedAt }
 */

export const LINKS_COLLECTION = 'marketing_links';

/**
 * The public path prefix of tracked links. Deliberately NOT disallowed in
 * robots.txt: a 302 isn't indexed (crawlers follow it to the target, whose
 * canonical has no query), every card fetcher must be able to read it, and
 * the bot filter keeps crawlers out of the counts.
 */
export const GO_PREFIX = '/go/';

/** A link id is the piece id: channel prefix (x, li, yt) + a 3+ digit number, e.g. `x-001`. */
export const LINK_ID_RE = /^(x|li|yt)-\d{3,}$/;

export function isLinkId(id: string): boolean {
  return LINK_ID_RE.test(id);
}

/**
 * Agents that are not a person clicking (substring match, any case):
 *
 * - link-preview / card fetchers — what a social, chat or embed platform
 *   sends to build a post's card: X, LinkedIn, Facebook, Slack, Discord,
 *   WhatsApp, Telegram, Pinterest (its pin fetcher "Pinterest/0.x" and its
 *   crawler only — the in-app browser says "[Pinterest/iOS]" /
 *   "[Pinterest/Android]" and is a person), Reddit, Bluesky (Cardyb),
 *   Mastodon instances ("http.rb (Mastodon/…)"), Iframely, Embedly;
 * - search crawlers and the generic `crawler|spider|preview` words;
 * - any agent carrying a `+http://` / `+https://` contact URL — the crawler
 *   and fetcher convention ("(+http://www.google.com/bot.html)"), which real
 *   browsers never carry;
 * - HTTP libraries and headless browsers.
 */
const NOT_A_PERSON = [
  'Twitterbot',
  'LinkedInBot',
  'facebookexternalhit',
  'Facebot',
  'Slackbot',
  'Discordbot',
  'WhatsApp',
  'TelegramBot',
  'Pinterest/0.',
  'Pinterestbot',
  'redditbot',
  'Cardyb',
  'Mastodon',
  'Iframely',
  'Embedly',
  'Googlebot',
  'bingbot',
  'crawler',
  'spider',
  'preview',
  '+http://',
  '+https://',
  'curl',
  'wget',
  'python-',
  'go-http-client',
  'okhttp',
  'axios',
  'node-fetch',
  'undici',
  'headlesschrome',
  'lighthouse',
];

/**
 * Any other "…bot" PRODUCT token: a letter, digit or `_`, then "bot", then
 * the end of the token — `/version`, `-variant`, `;`, `)`, ` (comment)` or
 * the end of the string (Googlebot/2.1, MJ12bot/v1.4.8, Mail.RU_Bot/2.0,
 * Slackbot-LinkExpanding, "TelegramBot (like TwitterBot)", "PetalBot;").
 * Never a bare substring, and `_` never ends the token: device models like
 * CUBOT_X19 or "CUBOT X30" are real phones.
 */
const BOT_TOKEN = '[a-z0-9_]bot(?:[/;)-]| \\(|$)';

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const BOT_UA_RE = new RegExp(
  NOT_A_PERSON.map(escapeRegExp).concat(BOT_TOKEN).join('|'),
  'i',
);

/** A missing or empty user agent is a script, not a person. */
export function isBotUserAgent(ua: string | null | undefined): boolean {
  if (!ua || !ua.trim()) return true;
  return BOT_UA_RE.test(ua);
}

/** Browser speculative loads (link prefetch / prerender / Safari's preview) announce themselves. */
export function isSpeculativeLoad(headers: Pick<Headers, 'get'>): boolean {
  for (const name of ['sec-purpose', 'purpose', 'x-purpose', 'x-moz']) {
    const value = headers.get(name);
    if (value && /prefetch|prerender|preview/i.test(value)) return true;
  }
  return false;
}

/**
 * Only a real click counts: a GET (link and mail scanners HEAD-probe; HEAD
 * never counts) from a browser that isn't a known fetcher or a speculative
 * load.
 */
export function shouldCountClick(method: string, headers: Pick<Headers, 'get'>): boolean {
  if (method.toUpperCase() !== 'GET') return false;
  if (isBotUserAgent(headers.get('user-agent'))) return false;
  return !isSpeculativeLoad(headers);
}

/**
 * Wait for `work` at most `ms`: true when it fulfilled in time, false when
 * the wait gave up (the work itself keeps running). It owns no error
 * handling: a rejection inside the wait propagates, so `work` must carry its
 * own handler (`/go` attaches exactly one, which logs a failed write).
 */
export function settleWithin(work: Promise<unknown>, ms: number): Promise<boolean> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const gaveUp = new Promise<boolean>((resolve) => {
    timer = setTimeout(() => resolve(false), ms);
  });
  return Promise.race([work.then(() => true), gaveUp]).finally(() => clearTimeout(timer));
}

/** True for a tracked-link path (`/go/...`): never in the sitemap (checked on the path, before it becomes a URL). */
export function isGoPath(path: string): boolean {
  return path.startsWith(GO_PREFIX);
}

/** The UTC calendar day a click is counted under (`clicks_by_day` key). */
export function dayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * The redirect address: the stored target with the link's campaign tags set
 * (a tag already on the target is replaced; every other parameter and the
 * fragment are kept). Null when the target isn't an https address.
 */
export function withUtms(target: string, utms: Partial<Record<LinkUtmKey, unknown>>): string | null {
  let url: URL;
  try {
    url = new URL(target);
  } catch {
    return null;
  }
  if (url.protocol !== 'https:') return null;
  for (const key of LINK_UTM_KEYS) {
    const value = utms[key];
    if (typeof value === 'string' && value.length > 0) url.searchParams.set(key, value);
  }
  return url.toString();
}

/**
 * A campaign tag value: 1–TAG_MAX characters (the console's own bound, so
 * a tag that leaves here is never dropped there), no control characters, no
 * surrounding spaces.
 */
const tagValue = z
  .string({ error: (iss) => (iss.input === undefined ? 'required' : 'must be a string') })
  .min(1, 'required')
  .max(TAG_MAX, `at most ${TAG_MAX} characters`)
  .regex(/^[^\u0000-\u001f\u007f]+$/, 'no control characters')
  .refine((v) => v.trim() === v, 'no leading or trailing spaces');

/** An absolute https address without credentials. */
const targetUrl = z
  .string({ error: (iss) => (iss.input === undefined ? 'required' : 'must be a string') })
  .max(2000, 'at most 2000 characters')
  .refine((value) => {
    try {
      const url = new URL(value);
      return url.protocol === 'https:' && !url.username && !url.password;
    } catch {
      return false;
    }
  }, 'an absolute https:// address');

/**
 * PUT body (strict: unknown or misspelled fields are rejected). The counters
 * and timestamps are server-managed and can't be sent. An omitted
 * `utm_content` is the link id (the piece id, the tracking convention) on
 * create and the stored value on update (`linkConfig`).
 */
export const LinkInputSchema = z.strictObject(
  {
    target: targetUrl,
    utm_source: tagValue,
    utm_medium: tagValue,
    utm_campaign: tagValue,
    utm_content: tagValue.optional(),
  },
  {
    // Explicit messages: the production bundle ships zod without its default
    // English messages, which would leave "Invalid input" for every issue.
    error: (iss) =>
      iss.code === 'unrecognized_keys'
        ? `unknown field(s): ${iss.keys.join(', ')}`
        : iss.code === 'invalid_type'
          ? 'body must be a JSON object'
          : undefined,
  },
);

export type LinkInput = z.infer<typeof LinkInputSchema>;

/** The editable fields as stored: the input with `utm_content` resolved. */
export type LinkConfig = Required<LinkInput>;

/**
 * The editable fields a PUT writes. `utm_content`, when the body leaves it
 * out, defaults to the id on create only; on update the stored value stays
 * (a custom one is never reset to the id by a PUT that didn't mention it).
 */
export function linkConfig(id: string, input: LinkInput, existing?: { utm_content?: unknown } | null): LinkConfig {
  const kept = existing && typeof existing.utm_content === 'string' && existing.utm_content ? existing.utm_content : id;
  return { ...input, utm_content: input.utm_content ?? kept };
}

export interface StoredLink extends LinkConfig {
  clicks: number;
  clicks_by_day: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

/** The document a new link starts as: zero clicks, an empty day map. */
export function newLinkDoc(config: LinkConfig, now: Date): StoredLink {
  const at = now.toISOString();
  return { ...config, clicks: 0, clicks_by_day: {}, createdAt: at, updatedAt: at };
}

/**
 * A stored document read back for the API: known fields only, counters
 * defaulted (a link no one clicked has no day keys), non-numeric day values
 * dropped.
 */
export function readStoredLink(raw: Record<string, unknown>): StoredLink {
  const str = (v: unknown) => (typeof v === 'string' ? v : '');
  const days: Record<string, number> = {};
  const rawDays = raw.clicks_by_day;
  if (rawDays && typeof rawDays === 'object' && !Array.isArray(rawDays)) {
    for (const [day, n] of Object.entries(rawDays as Record<string, unknown>)) {
      if (typeof n === 'number' && Number.isFinite(n)) days[day] = n;
    }
  }
  return {
    target: str(raw.target),
    utm_source: str(raw.utm_source),
    utm_medium: str(raw.utm_medium),
    utm_campaign: str(raw.utm_campaign),
    utm_content: str(raw.utm_content),
    clicks: typeof raw.clicks === 'number' && Number.isFinite(raw.clicks) ? raw.clicks : 0,
    clicks_by_day: days,
    createdAt: str(raw.createdAt),
    updatedAt: str(raw.updatedAt),
  };
}
