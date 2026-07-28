import type { MetadataRoute } from 'next';
import { CONTENT_TYPES, type ContentType } from '@/lib/content-types';
import { listContent } from '@/lib/content';
import { siteUrl } from '@/lib/site';

export const revalidate = 300;

/** Static pages that are not registry-driven. */
const STATIC_PATHS = ['/', '/docs', '/changelog', '/privacy', '/terms'];

/**
 * Registry-driven sitemap: the static pages plus every entry of every
 * content type with `sitemap: true`. Entries whose canonical path is a
 * fragment on the list page (e.g. changelog) are skipped — sitemap URLs
 * can't carry fragments, and the list page itself is already listed.
 * Adding a content type needs zero code here.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const urls: MetadataRoute.Sitemap = STATIC_PATHS.map((path) => ({ url: siteUrl(path) }));

  const types = CONTENT_TYPES as readonly unknown[] as readonly ContentType[];
  for (const type of types.filter((t) => t.flags.sitemap)) {
    // The type's list page is covered by STATIC_PATHS today; include it for
    // future types whose urlBase is not in the static list.
    if (!STATIC_PATHS.includes(type.urlBase)) urls.push({ url: siteUrl(type.urlBase) });

    for (const entry of await listContent(type)) {
      const path = type.pathFor(entry);
      if (path.includes('#')) continue;
      const updatedAt = (entry as { updatedAt?: string }).updatedAt;
      urls.push({
        url: siteUrl(path),
        ...(updatedAt && !Number.isNaN(Date.parse(updatedAt))
          ? { lastModified: new Date(updatedAt) }
          : {}),
      });
    }
  }

  return urls;
}
