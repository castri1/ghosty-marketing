import { unstable_cache } from 'next/cache';
import { marked } from 'marked';
import {
  CONTENT_TYPES,
  requireContentType,
  type BlogEntry,
  type ChangelogEntry,
  type ContentType,
  type DocsEntry,
} from './content-types';
import { getDb } from './firestore';

/**
 * Registry-driven cached readers for the marketing pages (CAS-96 — replaced
 * the CAS-93 fixture loaders; the shapes pages consume are unchanged).
 *
 * Caching: each type's list is an `unstable_cache` entry tagged with the
 * type key. Writes through the content API call `revalidateTag(key)`, so
 * pages refresh immediately after a publish; the 300s revalidate here (and
 * `export const revalidate = 300` on the pages) is the backstop.
 *
 * Build-time posture: reads swallow store-unavailable errors and return [] —
 * `next build` needs no database credentials (pages prerender empty and fill
 * at runtime via ISR). See CLAUDE.md.
 *
 * Content is writable ONLY through the bearer-token content API (trusted
 * authors), which is the sole reason rendering with marked +
 * dangerouslySetInnerHTML downstream is acceptable — keep that invariant.
 */

async function fetchEntries<T>(type: ContentType<T>): Promise<T[]> {
  try {
    const snap = await getDb().collection(type.collection).get();
    const entries: T[] = [];
    for (const doc of snap.docs) {
      const parsed = type.storedSchema.safeParse(doc.data());
      if (parsed.success) {
        entries.push(parsed.data);
      } else {
        console.warn(`[content] skipping malformed ${type.key} entry ${doc.id}`);
      }
    }
    return entries.sort(type.compare);
  } catch (err) {
    console.warn(
      `[content] ${type.key} read unavailable (${err instanceof Error ? err.message : String(err)}) — serving empty`,
    );
    return [];
  }
}

/**
 * Boot-unique cache-key part (CAS-126): the credential-less build bakes EMPTY
 * data-cache entries into `.next`, and an ISR page re-render that reads such
 * an entry re-caches an empty page for another 300s. Salting the key with a
 * per-process id means a runtime server never reads entries written by the
 * build (or by a previous boot) — a cache miss triggers a fresh store fetch
 * instead. Tags are unchanged, so `revalidateTag` keeps working. The on-boot
 * revalidation in `instrumentation.ts` handles the page layer; this handles
 * the data layer even if that boot call is delayed.
 */
const BOOT_ID = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const readers = new Map(
  CONTENT_TYPES.map((t) => [
    t.key,
    unstable_cache(() => fetchEntries(t as ContentType<unknown>), ['content-list', t.key, BOOT_ID], {
      tags: [t.key],
      revalidate: 300,
    }),
  ]),
);

/** Sorted, schema-valid entries of a registry type (cached; see header). */
export function listContent<T>(type: ContentType<T>): Promise<T[]> {
  const read = readers.get(type.key);
  if (!read) throw new Error(`unregistered content type: ${type.key}`);
  return read() as Promise<T[]>;
}

/** marked.parse is sync unless async extensions are registered (none are). */
export function render(markdown: string): string {
  return marked.parse(markdown) as string;
}

// ── Page-facing shapes (unchanged from the CAS-93 port) ──────────────────

export interface ReleaseEntry {
  /** URL-safe id, e.g. "integrations" from the 2026-07-14-integrations entry. */
  slug: string;
  /** YYYY-MM-DD. */
  date: string;
  title: string;
  /** Optional one-liner — shown under the title. */
  summary?: string;
  html: string;
}

export interface DocPage {
  slug: string;
  title: string;
  /** One-liner for the docs index and the page's meta description. */
  description?: string;
  order: number;
  html: string;
}

const docsType = requireContentType<DocsEntry>('docs');
const changelogType = requireContentType<ChangelogEntry>('changelog');
const blogType = requireContentType<BlogEntry>('blog');

/** All docs topics, sidebar order. */
export async function getDocPages(): Promise<DocPage[]> {
  const entries = await listContent<DocsEntry>(docsType);
  return entries.map((e) => ({
    slug: e.slug,
    title: e.title,
    ...(e.description ? { description: e.description } : {}),
    order: e.order,
    html: render(e.bodyMd),
  }));
}

export async function findDocPage(slug: string): Promise<DocPage | undefined> {
  return (await getDocPages()).find((p) => p.slug === slug);
}

/** All changelog entries, newest first. */
export async function getReleases(): Promise<ReleaseEntry[]> {
  const entries = await listContent<ChangelogEntry>(changelogType);
  return entries.map((e) => ({
    slug: e.slug,
    date: e.date,
    title: e.title,
    ...(e.summary ? { summary: e.summary } : {}),
    html: render(e.bodyMd),
  }));
}

export interface BlogPost {
  slug: string;
  /** YYYY-MM-DD publish date. */
  date: string;
  title: string;
  /** Meta description + list blurb. */
  description: string;
  tags: string[];
  faq: { q: string; a: string }[];
  html: string;
  /** 'en' (at /blog) or 'es' (at /es/blog). */
  lang: 'en' | 'es';
  /** Slug of the twin post in the other language, when there is one. */
  translationOf?: string;
  /** Server-stamped ISO datetime of the last write, when present. */
  updatedAt?: string;
}

/** Canonical path of a post, by language. */
export function blogPath(post: Pick<BlogPost, 'slug' | 'lang'>): string {
  return `${post.lang === 'es' ? '/es' : ''}/blog/${post.slug}`;
}

/** Blog posts newest first; `lang` narrows to one language. */
export async function getBlogPosts(lang?: 'en' | 'es'): Promise<BlogPost[]> {
  const entries = await listContent<BlogEntry>(blogType);
  return entries
    .filter((e) => !lang || e.lang === lang)
    .map((e) => ({
    slug: e.slug,
    date: e.date,
    title: e.title,
    description: e.description,
    tags: e.tags,
    faq: e.faq,
    html: render(e.bodyMd),
    lang: e.lang,
    ...(e.translationOf ? { translationOf: e.translationOf } : {}),
    ...((e as BlogEntry & { updatedAt?: string }).updatedAt
      ? { updatedAt: (e as BlogEntry & { updatedAt?: string }).updatedAt }
      : {}),
  }));
}

export async function findBlogPost(slug: string, lang?: 'en' | 'es'): Promise<BlogPost | undefined> {
  return (await getBlogPosts(lang)).find((p) => p.slug === slug);
}

/**
 * The twin of a post in the other language: the post it declares as
 * `translationOf`, or the post that declares it. Undefined when none.
 */
export async function findBlogTwin(post: BlogPost): Promise<BlogPost | undefined> {
  const all = await getBlogPosts();
  const other = post.lang === 'es' ? 'en' : 'es';
  return all.find(
    (p) => p.lang === other && (p.slug === post.translationOf || p.translationOf === post.slug),
  );
}

const MONTHS_ES = [
  'enero',
  'febrero',
  'marzo',
  'abril',
  'mayo',
  'junio',
  'julio',
  'agosto',
  'septiembre',
  'octubre',
  'noviembre',
  'diciembre',
];

/** "2026-07-14" → "14 de julio de 2026". */
export function formatDateEs(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d || m < 1 || m > 12) return date;
  return `${d} de ${MONTHS_ES[m - 1]} de ${y}`;
}

/** "2026-07-14" → "July 14, 2026" (UTC-safe: no Date parsing of bare dates). */
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export function formatReleaseDate(date: string): string {
  const [y, m, d] = date.split('-').map(Number);
  if (!y || !m || !d || m < 1 || m > 12) return date;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}
