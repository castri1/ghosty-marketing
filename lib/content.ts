import fs from 'node:fs';
import path from 'node:path';
import { marked } from 'marked';

/**
 * Fixture-markdown loaders for the marketing surfaces, ported from the
 * console's src/marketing/content.ts (CAS-93):
 *
 *   fixtures/releases/YYYY-MM-DD-<slug>.md  →  getghosty.dev/changelog
 *   fixtures/site/<topic>.md                →  getghosty.dev/docs/<topic>
 *
 * The console bundled the same files via Vite raw glob imports; here they are
 * read from the repo's fixtures/ at build time (all pages are static). M2
 * replaces this file with the Firestore content registry — keep the parser
 * and rendering identical so that swap is invisible.
 *
 * Content is repo-authored (trusted), so rendering with marked +
 * dangerouslySetInnerHTML is deliberate — no sanitizer needed.
 */

function readDir(dir: string): Record<string, string> {
  const abs = path.join(process.cwd(), dir);
  const out: Record<string, string> = {};
  for (const name of fs.readdirSync(abs)) {
    if (!name.endsWith('.md')) continue;
    out[name] = fs.readFileSync(path.join(abs, name), 'utf8');
  }
  return out;
}

const releaseFiles = readDir('fixtures/releases');
const siteFiles = readDir('fixtures/site');

interface Parsed {
  meta: Record<string, string>;
  body: string;
}

/** Minimal `--- key: value ---` frontmatter parser (flat string values only). */
function parseFrontmatter(raw: string): Parsed {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key) meta[key] = value;
  }
  return { meta, body: raw.slice(match[0].length) };
}

/** marked.parse is sync unless async extensions are registered (none are). */
function render(markdown: string): string {
  return marked.parse(markdown) as string;
}

export interface ReleaseEntry {
  /** URL-safe id, e.g. "integrations" from 2026-07-14-integrations.md. */
  slug: string;
  /** YYYY-MM-DD from the filename prefix. */
  date: string;
  title: string;
  /** Optional one-liner (frontmatter `summary`) — shown under the title. */
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

const RELEASE_FILE = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;

/** All changelog entries, newest first. */
export const releases: ReleaseEntry[] = Object.entries(releaseFiles)
  .map(([name, raw]): ReleaseEntry | null => {
    const file = RELEASE_FILE.exec(name);
    if (!file) return null; // README.md and anything not date-prefixed
    const { meta, body } = parseFrontmatter(raw);
    return {
      slug: file[2],
      date: meta.date || file[1],
      title: meta.title || file[2],
      ...(meta.summary ? { summary: meta.summary } : {}),
      html: render(body),
    };
  })
  .filter((e): e is ReleaseEntry => e !== null)
  .sort((a, b) => (a.date === b.date ? a.slug.localeCompare(b.slug) : b.date.localeCompare(a.date)));

/** All docs topics, sidebar order. */
export const docPages: DocPage[] = Object.entries(siteFiles)
  .map(([name, raw]): DocPage | null => {
    if (name.toUpperCase() === 'README.MD') return null;
    const { meta, body } = parseFrontmatter(raw);
    const slug = name.replace(/\.md$/, '');
    return {
      slug,
      title: meta.title || slug,
      ...(meta.description ? { description: meta.description } : {}),
      order: meta.order && Number.isFinite(Number(meta.order)) ? Number(meta.order) : 999,
      html: render(body),
    };
  })
  .filter((p): p is DocPage => p !== null)
  .sort((a, b) => (a.order === b.order ? a.title.localeCompare(b.title) : a.order - b.order));

export function findDocPage(slug: string): DocPage | undefined {
  return docPages.find((p) => p.slug === slug);
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
