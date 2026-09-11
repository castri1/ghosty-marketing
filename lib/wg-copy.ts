/**
 * Compatibility shim. The copy moved to lib/i18n/ (en.ts + es.ts) when the
 * site went bilingual; the ported lab components keep importing from here.
 * `copy` is the English dictionary; `localizeHref` is the real one now.
 */
export { en as copy } from '@/lib/i18n/en';
export type { Dictionary } from '@/lib/i18n/en';
export type { Locale } from '@/lib/i18n/config';
export { localizeHref } from '@/lib/i18n/href';
