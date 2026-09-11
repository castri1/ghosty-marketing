/** i18n config: English at the root paths (default), Spanish under /es. */

export const locales = ['en', 'es'] as const;
export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** Human label for the language switcher. */
export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español',
};

export function otherLocale(locale: Locale): Locale {
  return locale === 'es' ? 'en' : 'es';
}

/** OpenGraph locale tags. */
export const ogLocale: Record<Locale, string> = { en: 'en_US', es: 'es_LA' };
