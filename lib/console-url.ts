/**
 * The marketing site is anonymous — every sign-in/join CTA is an absolute
 * link into the One Console. NEXT_PUBLIC_CONSOLE_URL overrides the target
 * (e.g. a staging console); it is inlined at build time.
 */
const CONSOLE_URL = (process.env.NEXT_PUBLIC_CONSOLE_URL ?? 'https://console.whiteghost.ai').replace(
  /\/+$/,
  '',
);

export function consoleUrl(path: string): string {
  return `${CONSOLE_URL}${path}`;
}

/**
 * Placements that are a button rather than a page: the nav button (on every
 * page), the home page's hero and closing buttons, and `chrome` for every
 * other generic "/waitlist" link (lib/i18n/href.ts). One distinct value each,
 * the same in every locale, so the console can tell which button converted.
 * The creator section's `home-creator` lives in components/wg/AltCreator.tsx.
 */
export const CTA_REF = {
  nav: 'nav',
  homeHero: 'home-hero',
  homeCta: 'home-cta',
  generic: 'chrome',
} as const;

/**
 * The sign-up CTA link. `ref` names the placement (the page's canonical path
 * without the leading slash, or a `CTA_REF` for a button) so the console can
 * record where a sign-up came from and GA4 can attribute it across domains.
 * GTM's `cta_signup_click` trigger matches on `console.whiteghost.ai/signup`,
 * which the query string does not disturb. When the visitor arrived with
 * campaign tags, the first-touch script swaps these `utm_*` for theirs as the
 * link is used (lib/first-touch.ts); the rendered link never changes.
 *
 * `plan` carries a plan the visitor already picked, as the console's own
 * `plan=` parameter (`solo`: the console's plan step opens with Solo
 * selected). It is a console intent, not a campaign tag, so it survives the
 * first-touch swap.
 */
export function signupUrl(ref: string, campaign: string = ref, opts: { plan?: 'solo' } = {}): string {
  const q = new URLSearchParams({
    ref,
    utm_source: 'whiteghost.ai',
    utm_medium: 'cta',
    utm_campaign: campaign,
  });
  if (opts.plan) q.set('plan', opts.plan);
  return consoleUrl(`/signup?${q.toString()}`);
}
