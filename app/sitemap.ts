import type { MetadataRoute } from 'next';
import { CONTENT_TYPES, type ContentType } from '@/lib/content-types';
import { listContent } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import { ROUTES, esPathFor } from '@/lib/routes';
import { blogPath, getBlogPosts } from '@/lib/content';
import { GLOSSARY } from '@/lib/glossary';

export const revalidate = 300;

/**
 * Static pages come from lib/routes.ts (single source of truth shared with
 * llms.txt); glossary terms from lib/glossary.ts. Nothing is listed by hand.
 * Bilingual routes emit both URLs, each with hreflang alternates (x-default
 * is the English page).
 */
const STATIC_PATHS = [...ROUTES.map((r) => r.path), ...GLOSSARY.map((g) => `/glossary/${g.slug}`)];

function alternatesFor(en: string, es: string) {
  return { languages: { en: siteUrl(en), es: siteUrl(es), 'x-default': siteUrl(en) } };
}

/**
 * Registry-driven sitemap: the static pages plus every entry of every
 * content type with `sitemap: true`. Entries whose canonical path is a
 * fragment on the list page (e.g. changelog) are skipped — sitemap URLs
 * can't carry fragments, and the list page itself is already listed.
 * Adding a content type needs zero code here.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = [];
  for (const path of STATIC_PATHS) {
    const es = esPathFor(path);
    if (es) {
      urls.push({ url: siteUrl(path), alternates: alternatesFor(path, es) });
      urls.push({ url: siteUrl(es), alternates: alternatesFor(path, es) });
    } else {
      urls.push({ url: siteUrl(path) });
    }
  }

  // Blog posts carry their own language pairs (translationOf).
  const posts = await getBlogPosts();
  const twinOf = (slug: string, lang: 'en' | 'es') =>
    posts.find((p) => p.lang !== lang && (p.slug === slug || p.translationOf === slug));

  const types = CONTENT_TYPES as readonly unknown[] as readonly ContentType[];
  for (const type of types.filter((t) => t.flags.sitemap)) {
    // The type's list page is covered by STATIC_PATHS today; include it for
    // future types whose urlBase is not in the static list.
    if (!STATIC_PATHS.includes(type.urlBase)) urls.push({ url: siteUrl(type.urlBase) });

    for (const entry of await listContent(type)) {
      const path = type.pathFor(entry);
      if (path.includes('#')) continue;
      const updatedAt = (entry as { updatedAt?: string }).updatedAt;
      let alternates: ReturnType<typeof alternatesFor> | undefined;
      if (type.key === 'blog') {
        const e = entry as { slug: string; lang: 'en' | 'es'; translationOf?: string };
        const twin = twinOf(e.translationOf ?? e.slug, e.lang);
        if (twin) {
          const enPath = e.lang === 'en' ? path : blogPath(twin);
          const esPath = e.lang === 'es' ? path : blogPath(twin);
          alternates = alternatesFor(enPath, esPath);
        }
      }
      urls.push({
        url: siteUrl(path),
        ...(updatedAt && !Number.isNaN(Date.parse(updatedAt))
          ? { lastModified: new Date(updatedAt) }
          : {}),
        ...(alternates ? { alternates } : {}),
      });
    }
  }

  return urls;
}
