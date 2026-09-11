import type { Metadata } from 'next';
import { enPathFor, esPathFor } from './routes';
import { ogLocale, type Locale } from './i18n/config';

/**
 * Canonical site origin for absolute URLs (canonicals, sitemap, llms.txt,
 * RSS, OG). NEXT_PUBLIC_SITE_URL overrides it (e.g. a staging deploy); it is
 * inlined at build time, same pattern as lib/console-url.ts.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? 'https://whiteghost.ai').replace(
  /\/+$/,
  '',
);

export function siteUrl(path: string): string {
  return `${SITE_URL}${path}`;
}

/**
 * Per-page SEO metadata: title, description, canonical, OpenGraph + Twitter
 * card. Every page builds its `metadata` / `generateMetadata` through this so
 * the tags stay uniform (og.png is resolved against `metadataBase` set in the
 * root layout). Descriptions are user/agent-visible — vendor-free language
 * only (house rule).
 */
export function pageMeta(opts: {
  title: string;
  description: string;
  path: string;
  /** 'article' for blog posts (adds article:published_time etc.); default 'website'. */
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  /** Language of the page; default English. Drives og:locale and hreflang. */
  locale?: Locale;
  /**
   * Explicit language alternates (canonical paths per locale) for pages that
   * are not in lib/routes.ts, e.g. a blog post and its translation. Static
   * pages get them derived from the routes registry automatically.
   */
  alternates?: Partial<Record<Locale, string>>;
}): Metadata {
  const {
    title,
    description,
    path,
    type = 'website',
    publishedTime,
    modifiedTime,
    tags,
    locale = 'en',
    alternates,
  } = opts;
  const url = siteUrl(path);
  const languages = hreflang(path, locale, alternates);
  const og =
    type === 'article'
      ? {
          type: 'article' as const,
          ...(publishedTime ? { publishedTime } : {}),
          ...(modifiedTime ? { modifiedTime } : {}),
          ...(tags && tags.length > 0 ? { tags } : {}),
          authors: [siteUrl('/about')],
        }
      : { type: 'website' as const };
  return {
    title,
    description,
    alternates: { canonical: url, ...(languages ? { languages } : {}) },
    openGraph: {
      title,
      description,
      url,
      siteName: 'White Ghost',
      images: ['/og.png'],
      locale: ogLocale[locale],
      ...og,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
  };
}

/**
 * hreflang set for a page: {en, es, x-default} as absolute URLs, when the
 * page exists in both languages. Static pages are looked up in lib/routes.ts;
 * content pages pass their own pair. x-default is always the English page.
 */
export function hreflang(
  path: string,
  locale: Locale,
  explicit?: Partial<Record<Locale, string>>,
): Record<string, string> | undefined {
  let en: string | undefined;
  let es: string | undefined;
  if (explicit) {
    en = explicit.en;
    es = explicit.es;
  } else if (locale === 'en') {
    en = path;
    es = esPathFor(path);
  } else {
    es = path;
    en = enPathFor(path);
  }
  if (!en || !es) return undefined;
  return { en: siteUrl(en), es: siteUrl(es), 'x-default': siteUrl(en) };
}
