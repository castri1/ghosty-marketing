import { z } from 'zod';

/**
 * THE content-type registry (CAS-96). Every generic surface iterates this
 * file: the content API, the cached readers, the seed script — and (M3) the
 * sitemap, llms.txt, and RSS surfaces. Adding a content type = adding an
 * entry here + a pair of pages (see the checklist in CLAUDE.md); nothing
 * else needs code.
 */

/** Fields every content type shares. `updatedAt` is server-stamped on write. */
const base = z.object({
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'lowercase letters, digits and dashes'),
  title: z.string().min(1),
  bodyMd: z.string(),
});

const docsSchema = base.extend({
  /** Sidebar position; entries without one sort last (matches the old frontmatter contract). */
  order: z.number().int().min(0).default(999),
  description: z.string().optional(),
});

const changelogSchema = base.extend({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD'),
  summary: z.string().optional(),
});

export type DocsEntry = z.infer<typeof docsSchema>;
export type ChangelogEntry = z.infer<typeof changelogSchema>;

export interface ContentType<T = Record<string, unknown>> {
  /** Registry key — also the API path segment and the cache tag. */
  key: string;
  /** Firestore collection the entries live in. */
  collection: string;
  /** Public URL base the entries render under. */
  urlBase: string;
  /** PUT-body schema; stored docs additionally carry `updatedAt` (ISO string). */
  schema: z.ZodType<T>;
  /** Document id for an entry — the `[id]` segment of the content API. */
  idFor: (entry: T) => string;
  /** Presentation order (applied in-memory; reads are whole-collection, no indexes). */
  compare: (a: T, b: T) => number;
  /** Which generic public surfaces include this type (consumed in M3). */
  flags: { sitemap: boolean; llmsTxt: boolean; rss: boolean };
}

const docsType: ContentType<DocsEntry> = {
  key: 'docs',
  collection: 'marketing_docs',
  urlBase: '/docs',
  schema: docsSchema,
  idFor: (e) => e.slug,
  compare: (a, b) => (a.order === b.order ? a.title.localeCompare(b.title) : a.order - b.order),
  flags: { sitemap: true, llmsTxt: true, rss: false },
};

const changelogType: ContentType<ChangelogEntry> = {
  key: 'changelog',
  collection: 'marketing_changelog',
  urlBase: '/changelog',
  schema: changelogSchema,
  idFor: (e) => `${e.date}-${e.slug}`,
  compare: (a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)),
  flags: { sitemap: true, llmsTxt: true, rss: true },
};

export const CONTENT_TYPES = [docsType, changelogType] as const;

export function findContentType(key: string): ContentType | undefined {
  // Erase the per-type generics for the generic surfaces (API routes) — they
  // only use schema/idFor/compare through the ContentType interface.
  const types = CONTENT_TYPES as readonly unknown[] as readonly ContentType[];
  return types.find((t) => t.key === key);
}
