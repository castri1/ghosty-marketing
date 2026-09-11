import { consoleUrl } from '@/lib/console-url';
import { esPathFor } from '@/lib/routes';
import type { Locale } from './config';

/**
 * Turn a canonical (English) href into the one to render for `locale`.
 * - The retired waitlist and the sign-in link go to the console.
 * - Anchors, mailto:, tel: and absolute URLs are left alone.
 * - For Spanish, paths that have a Spanish page (lib/routes.ts) get their
 *   /es path; everything else (docs, changelog, glossary, legal) stays on
 *   the English page rather than 404ing.
 */
export function localizeHref(href: string, locale: Locale = 'en'): string {
  if (href === '/waitlist') return consoleUrl('/signup');
  if (href === '/signin') return consoleUrl('/login');
  if (
    href.startsWith('#') ||
    href.startsWith('mailto:') ||
    href.startsWith('tel:') ||
    href.startsWith('http://') ||
    href.startsWith('https://')
  ) {
    return href;
  }
  if (locale === 'en') return href;
  const hashAt = href.indexOf('#');
  const path = hashAt === -1 ? href : href.slice(0, hashAt);
  const hash = hashAt === -1 ? '' : href.slice(hashAt);
  const es = esPathFor(path);
  return es ? `${es}${hash}` : href;
}
