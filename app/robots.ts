import type { MetadataRoute } from 'next';
import { siteUrl } from '@/lib/site';

/** Everything public is crawlable; /admin is operator-only. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: siteUrl('/sitemap.xml'),
  };
}
