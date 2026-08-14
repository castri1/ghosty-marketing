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
export function pageMeta(opts: { title: string; description: string; path: string }): Metadata {
  const { title, description, path } = opts;
  const url = siteUrl(path);
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: 'White Ghost',
      type: 'website',
      images: ['/og.png'],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: ['/og.png'],
    },
  };
}
