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
 * The sign-up CTA link. `ref` names the placement (the page's canonical path
 * without the leading slash, or `chrome` for nav/footer) so the console can
 * record where a sign-up came from and GA4 can attribute it across domains.
 * GTM's `cta_signup_click` trigger matches on `console.whiteghost.ai/signup`,
 * which the query string does not disturb.
 */
export function signupUrl(ref: string, campaign: string = ref): string {
  const q = new URLSearchParams({
    ref,
    utm_source: 'whiteghost.ai',
    utm_medium: 'cta',
    utm_campaign: campaign,
  });
  return consoleUrl(`/signup?${q.toString()}`);
}
