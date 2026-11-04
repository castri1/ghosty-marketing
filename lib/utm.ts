/**
 * Campaign-tag constants shared by tracked links (lib/links.ts) and the
 * first-touch pass-through: lib/first-touch.ts hands `UTM_KEYS` and `TAG_MAX`
 * to the static script public/ft.js through its tag's `data-keys` /
 * `data-max` attributes. Zod-free and import-free, so `node --test` runs it
 * natively.
 */

/** The tags a tracked link sets on its redirect. */
export const LINK_UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content'] as const;

/** The tags a first touch keeps: a link's tags plus `utm_term` (search campaigns). */
export const UTM_KEYS = [...LINK_UTM_KEYS, 'utm_term'] as const;

export type UtmKey = (typeof UTM_KEYS)[number];
export type LinkUtmKey = (typeof LINK_UTM_KEYS)[number];

/**
 * Longest tag value, in characters — the bound the console accepts for a
 * first touch, so a tag that leaves the site is never dropped there.
 */
export const TAG_MAX = 100;
