/**
 * Single source of truth for the static (non-registry) pages of the site.
 * Drives the sitemap (with hreflang alternates), llms.txt / llms-es.txt, the
 * language switcher and the weekly SEO check, so a new page is added ONCE
 * here and shows up everywhere. Registry-driven content (docs, changelog,
 * blog) and the glossary come from their own lists.
 *
 * `path` is the canonical English path. `es` marks the Spanish twin: `true`
 * when it lives at `/es<path>`, or an explicit `/es/...` path when the
 * Spanish slug differs. `llms` / `llmsEs` are the labels for the agent
 * indexes; pages without one are in the sitemap but not in the index.
 */
export interface SiteRoute {
  path: string;
  llms?: string;
  es?: true | string;
  llmsEs?: string;
}

export const ROUTES: SiteRoute[] = [
  { path: '/', llms: 'Home', es: true, llmsEs: 'Inicio' },
  { path: '/about', llms: 'About White Ghost (what it is, and what it is not)', es: true, llmsEs: 'Quiénes somos (qué es White Ghost y qué no es)' },
  { path: '/pricing', llms: 'Pricing (Free, Solo, Team, Org, Enterprise; what a plan sizes is how many apps stay awake)', es: true, llmsEs: 'Precios (Free, Solo, Team, Org, Enterprise; el plan dimensiona cuántas apps quedan despiertas)' },
  { path: '/security', llms: 'Security and your data', es: true, llmsEs: 'Seguridad y tus datos' },
  { path: '/story', llms: 'The story: why White Ghost exists', es: true, llmsEs: 'La historia: por qué existe White Ghost' },
  { path: '/use-cases', llms: 'Use cases by team', es: true, llmsEs: 'Casos de uso por equipo' },
  { path: '/use-cases/commercial', llms: 'Use case: commercial teams', es: true, llmsEs: 'Caso de uso: equipo comercial' },
  { path: '/use-cases/finance', llms: 'Use case: finance teams', es: true, llmsEs: 'Caso de uso: finanzas' },
  { path: '/use-cases/operations', llms: 'Use case: operations teams', es: true, llmsEs: 'Caso de uso: operaciones' },
  { path: '/compare', llms: 'Comparisons hub', es: true, llmsEs: 'Comparativas' },
  { path: '/compare/stack', llms: 'White Ghost vs. piecing together your own stack', es: true, llmsEs: 'White Ghost vs. armar tu propio stack' },
  { path: '/compare/vercel', llms: 'White Ghost vs. Vercel', es: true, llmsEs: 'White Ghost vs. Vercel' },
  { path: '/localhost', llms: 'You cannot send a localhost link: how to share an app that only opens on your computer', es: true, llmsEs: 'Por qué tu equipo no puede abrir tu link de localhost (y cómo compartirlo de verdad)' },
  { path: '/share/claude-code', llms: 'How to share what you built with Claude Code with your team', es: '/es/compartir/claude-code', llmsEs: 'Cómo compartir lo que hiciste en Claude Code con tu equipo' },
  { path: '/deploy', llms: 'Deploy guides hub (by AI coding assistant)' },
  { path: '/deploy/ai-coding-assistant', llms: 'How to deploy an app built with an AI coding assistant' },
  { path: '/deploy/claude-code', llms: 'How to deploy an app built with Claude Code' },
  { path: '/deploy/codex', llms: 'How to deploy an app built with Codex' },
  { path: '/docs', llms: 'Docs' },
  { path: '/changelog', llms: 'Changelog' },
  { path: '/blog', llms: 'Blog', es: true, llmsEs: 'Blog en español' },
  { path: '/glossary', llms: 'Glossary (shadow AI, vibe coding, BYOC, MCP server, pull request preview, OAuth device flow, scale to zero, rollback)' },
  { path: '/privacy', llms: 'Privacy policy' },
  { path: '/terms', llms: 'Terms of service' },
];

/** The Spanish path of a canonical path, or undefined when there is none. */
export function esPathFor(path: string): string | undefined {
  const route = ROUTES.find((r) => r.path === path);
  if (!route || !route.es) return undefined;
  return route.es === true ? (path === '/' ? '/es' : `/es${path}`) : route.es;
}

/** The canonical (English) path of a Spanish path, or undefined. */
export function enPathFor(esPath: string): string | undefined {
  return ROUTES.find((r) => esPathFor(r.path) === esPath)?.path;
}

/** Every English path (sitemap, SEO check). */
export function routePaths(): string[] {
  return ROUTES.map((r) => r.path);
}

/** Every Spanish path. */
export function esRoutePaths(): string[] {
  return ROUTES.map((r) => esPathFor(r.path)).filter((p): p is string => Boolean(p));
}
