import { z } from 'zod';

/**
 * THE content-type registry (CAS-96). Every generic surface iterates this
 * file: the content API, the cached readers, the seed script — and (M3) the
 * sitemap, llms.txt, and RSS surfaces. Adding a content type = adding an
 * entry here + a pair of pages (see the checklist in CLAUDE.md); nothing
 * else needs code.
 */

/**
 * Fields every content type shares. `updatedAt` is server-stamped on write.
 * Strict objects: PUT bodies with unknown/misspelled fields are rejected
 * instead of silently dropped (this API is automation-facing).
 */
const base = z.strictObject({
  slug: z.string().regex(/^[a-z0-9][a-z0-9-]*$/, 'lowercase letters, digits and dashes'),
  title: z.string().min(1),
  bodyMd: z.string(),
});

/** YYYY-MM-DD that is also a real calendar date. */
const calendarDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD')
  .refine((value) => {
    const [y, m, d] = value.split('-').map(Number);
    const date = new Date(Date.UTC(y, m - 1, d));
    return date.getUTCFullYear() === y && date.getUTCMonth() === m - 1 && date.getUTCDate() === d;
  }, 'not a real calendar date');

const docsSchema = base.extend({
  /** Sidebar position; entries without one sort last (matches the old frontmatter contract). */
  order: z.number().int().min(0).default(999),
  description: z.string().optional(),
});

const changelogSchema = base.extend({
  date: calendarDate,
  summary: z.string().optional(),
});

/** Q&A pair rendered as an on-page FAQ and emitted as FAQPage JSON-LD. */
const blogFaqItem = z.strictObject({
  q: z.string().min(1),
  a: z.string().min(1),
});

const blogSchema = base.extend({
  date: calendarDate,
  /** Meta description + list blurb (agent-visible; keep it under ~160 chars). */
  description: z.string().min(1),
  tags: z.array(z.string()).default([]),
  faq: z.array(blogFaqItem).default([]),
});

export type DocsEntry = z.infer<typeof docsSchema>;
export type ChangelogEntry = z.infer<typeof changelogSchema>;
export type BlogEntry = z.infer<typeof blogSchema>;

export interface ContentType<T = Record<string, unknown>> {
  /** Registry key — also the API path segment and the cache tag. */
  key: string;
  /** Human-readable plural name — llms.txt section headings, RSS channel titles. */
  label: string;
  /** Firestore collection the entries live in. */
  collection: string;
  /** Public URL base the entries render under. */
  urlBase: string;
  /** PUT-body schema (strict — unknown fields rejected). */
  schema: z.ZodType<T>;
  /** Read-path schema: the PUT shape plus the server-stamped `updatedAt`. */
  storedSchema: z.ZodType<T>;
  /** Document id for an entry — the `[id]` segment of the content API. */
  idFor: (entry: T) => string;
  /**
   * Canonical public path where an entry is read. Types with standalone
   * entry pages return them (docs: `/docs/<slug>`); types whose entries
   * render on the list page return a fragment (changelog:
   * `/changelog#<slug>`). Fragment paths are kept out of the sitemap
   * (fragments aren't valid there — the list page covers them) but are the
   * canonical link in llms.txt and RSS. The raw-markdown path is always
   * derived: `<urlBase>/<idFor(entry)>.md`.
   */
  pathFor: (entry: T) => string;
  /** Presentation order (applied in-memory; reads are whole-collection, no indexes). */
  compare: (a: T, b: T) => number;
  /** Which generic public surfaces include this type (consumed in M3). */
  flags: { sitemap: boolean; llmsTxt: boolean; rss: boolean };
}

const docsType: ContentType<DocsEntry> = {
  key: 'docs',
  label: 'Docs',
  collection: 'marketing_docs',
  urlBase: '/docs',
  schema: docsSchema,
  storedSchema: docsSchema.extend({ updatedAt: z.iso.datetime().optional() }),
  idFor: (e) => e.slug,
  pathFor: (e) => `/docs/${e.slug}`,
  compare: (a, b) => (a.order === b.order ? a.title.localeCompare(b.title) : a.order - b.order),
  flags: { sitemap: true, llmsTxt: true, rss: false },
};

const changelogType: ContentType<ChangelogEntry> = {
  key: 'changelog',
  label: 'Changelog',
  collection: 'marketing_changelog',
  urlBase: '/changelog',
  schema: changelogSchema,
  storedSchema: changelogSchema.extend({ updatedAt: z.iso.datetime().optional() }),
  idFor: (e) => `${e.date}-${e.slug}`,
  pathFor: (e) => `/changelog#${e.slug}`,
  compare: (a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)),
  flags: { sitemap: true, llmsTxt: true, rss: true },
};

const blogType: ContentType<BlogEntry> = {
  key: 'blog',
  label: 'Blog',
  collection: 'marketing_blog',
  urlBase: '/blog',
  schema: blogSchema,
  storedSchema: blogSchema.extend({ updatedAt: z.iso.datetime().optional() }),
  idFor: (e) => e.slug,
  pathFor: (e) => `/blog/${e.slug}`,
  compare: (a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)),
  flags: { sitemap: true, llmsTxt: true, rss: true },
};

export const CONTENT_TYPES = [docsType, changelogType, blogType] as const;

export function findContentType(key: string): ContentType | undefined {
  // Erase the per-type generics for the generic surfaces (API routes) — they
  // only use schema/idFor/compare through the ContentType interface.
  const types = CONTENT_TYPES as readonly unknown[] as readonly ContentType[];
  return types.find((t) => t.key === key);
}

/** Lookup by URL base segment (`docs` → the `/docs` type) — used by the
 * rewrite-backed raw-markdown route, where the path segment is the urlBase,
 * not the key. */
export function findContentTypeByBase(baseSegment: string): ContentType | undefined {
  const types = CONTENT_TYPES as readonly unknown[] as readonly ContentType[];
  return types.find((t) => t.urlBase === `/${baseSegment}`);
}

/** Key-based lookup for typed consumers that know their entry shape. */
export function requireContentType<T>(key: string): ContentType<T> {
  const type = findContentType(key);
  if (!type) throw new Error(`unregistered content type: ${key}`);
  return type as unknown as ContentType<T>;
}
