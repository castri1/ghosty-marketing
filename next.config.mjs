/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle — the Ghosty platform runs the site from
  // .next/standalone with no node_modules install at runtime. NOTE: `next
  // build` does NOT place `public/` or `.next/static` inside the standalone
  // dir; the deploy image (M4) must copy both in:
  //   cp -r public .next/standalone/public
  //   cp -r .next/static .next/standalone/.next/static
  output: 'standalone',
};

export default nextConfig;
