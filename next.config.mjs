import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';

/**
 * Content hash of the first-touch script (public/ft.js), computed when the
 * config loads at build time and inlined as process.env.FT_JS_HASH: the root
 * shell loads `/ft.js?v=<hash>`, so the file can be cached for a year
 * (headers() below) and a changed script is a new URL.
 */
const FT_JS_HASH = createHash('sha256')
  .update(readFileSync(new URL('./public/ft.js', import.meta.url)))
  .digest('hex')
  .slice(0, 16);

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: { FT_JS_HASH },
  // /ft.js is only ever referenced with its content hash (?v=…), so it is
  // immutable: browsers and the apex CDN keep it a year instead of
  // revalidating the script on every page view.
  async headers() {
    return [
      {
        source: '/ft.js',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ];
  },
  // Self-contained server bundle — the Ghosty platform runs the site from
  // .next/standalone with no node_modules install at runtime. NOTE: `next
  // build` does NOT place `public/` or `.next/static` inside the standalone
  // dir; the deploy image (M4) must copy both in:
  //   cp -r public .next/standalone/public
  //   cp -r .next/static .next/standalone/.next/static
  output: 'standalone',
  // Bound the stale-while-revalidate window ISR pages advertise (default is
  // ~1 year). With the apex CDN honoring origin headers, a huge swr would let
  // it serve stale copies long after s-maxage expires; 1 day matches Cloud
  // CDN's own serve-while-stale cap (CAS-127 codex review).
  expireTime: 86400,
  // Registry-generic agent-surface rewrites (CAS-97). Both are afterFiles:
  // real routes (sitemap.xml, robots.txt, llms.txt, public/ files) match
  // first, and the handlers 404 anything not in lib/content-types.ts — so
  // new content types get raw-markdown and RSS URLs with no config change.
  // Moved or renamed articles get a permanent redirect here (source → destination).
  // Language mismatches (an ES post requested under /blog) are handled at
  // runtime by the blog pages, so they never need an entry.
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      // /<urlBase>/<id>.md → raw markdown (app/raw/[type]/[id]/route.ts)
      { source: '/:base/:id.md', destination: '/raw/:base/:id' },
      // /<key>.xml → RSS feed for rss:true types (app/feed/[type]/route.ts)
      { source: '/:key.xml', destination: '/feed/:key' },
    ];
  },
};

export default nextConfig;
