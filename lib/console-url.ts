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
