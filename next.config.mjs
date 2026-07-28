/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle — the Ghosty platform runs the site from
  // .next/standalone with no node_modules install at runtime. NOTE: `next
  // build` does NOT place `public/` or `.next/static` inside the standalone
  // dir; the deploy image (M4) must copy both in:
  //   cp -r public .next/standalone/public
  //   cp -r .next/static .next/standalone/.next/static
  output: 'standalone',
  // Registry-generic agent-surface rewrites (CAS-97). Both are afterFiles:
  // real routes (sitemap.xml, robots.txt, llms.txt, public/ files) match
  // first, and the handlers 404 anything not in lib/content-types.ts — so
  // new content types get raw-markdown and RSS URLs with no config change.
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
