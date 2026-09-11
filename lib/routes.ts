/**
 * Single source of truth for the static (non-registry) pages of the site.
 * Drives the sitemap, the llms.txt index, and the weekly SEO check, so a new
 * page is added ONCE here and shows up everywhere. Registry-driven content
 * (docs, changelog, blog) and the glossary come from their own lists.
 *
 * `llms` is the label used in /llms.txt; pages without it are still in the
 * sitemap but not in the agent index (legal pages, hubs whose children are
 * already listed).
 */
export interface SiteRoute {
  path: string;
  llms?: string;
}

export const ROUTES: SiteRoute[] = [
  { path: '/', llms: 'Home' },
  { path: '/about', llms: 'About White Ghost (what it is, and what it is not)' },
  { path: '/pricing', llms: 'Pricing (Free, Solo, Team, Org, Enterprise; what a plan sizes is how many apps stay awake)' },
  { path: '/security', llms: 'Security and your data' },
  { path: '/story', llms: 'The story: why White Ghost exists' },
  { path: '/use-cases', llms: 'Use cases by team' },
  { path: '/use-cases/commercial', llms: 'Use case: commercial teams' },
  { path: '/use-cases/finance', llms: 'Use case: finance teams' },
  { path: '/use-cases/operations', llms: 'Use case: operations teams' },
  { path: '/compare', llms: 'Comparisons hub' },
  { path: '/compare/stack', llms: 'White Ghost vs. piecing together your own stack' },
  { path: '/compare/vercel', llms: 'White Ghost vs. Vercel' },
  { path: '/deploy', llms: 'Deploy guides hub (by AI coding assistant)' },
  { path: '/deploy/ai-coding-assistant', llms: 'How to deploy an app built with an AI coding assistant' },
  { path: '/deploy/claude-code', llms: 'How to deploy an app built with Claude Code' },
  { path: '/deploy/codex', llms: 'How to deploy an app built with Codex' },
  { path: '/docs', llms: 'Docs' },
  { path: '/changelog', llms: 'Changelog' },
  { path: '/blog', llms: 'Blog' },
  { path: '/glossary', llms: 'Glossary (shadow AI, vibe coding, BYOC, MCP server, pull request preview, OAuth device flow, scale to zero, rollback)' },
  { path: '/privacy', llms: 'Privacy policy' },
  { path: '/terms', llms: 'Terms of service' },
];

export function routePaths(): string[] {
  return ROUTES.map((r) => r.path);
}
