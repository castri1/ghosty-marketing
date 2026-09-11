import { en, type Dictionary } from './en';
import { es } from './es';
import type { Locale } from './config';

export type { Dictionary } from './en';
export type { Locale } from './config';
export { locales, defaultLocale, isLocale, localeNames, otherLocale, ogLocale } from './config';
export { localizeHref } from './href';

const dictionaries: Record<Locale, Dictionary> = { en, es };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}
