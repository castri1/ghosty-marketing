/** @type {import('next').NextConfig} */
const nextConfig = {
  // Self-contained server bundle — the Ghosty platform runs the site from
  // .next/standalone with no node_modules install at runtime.
  output: 'standalone',
};

export default nextConfig;
