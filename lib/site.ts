import type { Metadata } from 'next';

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
}): Metadata {
  const { title, description, path, type = 'website', publishedTime, modifiedTime, tags } = opts;
  const url = siteUrl(path);
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
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'White Ghost',
      images: ['/og.png'],
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
