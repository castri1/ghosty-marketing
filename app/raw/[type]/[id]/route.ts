import { findContentTypeByBase } from '@/lib/content-types';
import { listContent } from '@/lib/content';

/**
 * Raw-markdown view of a content entry: `/<urlBase>/<id>.md` rewrites here
 * (one generic rewrite in next.config.mjs), and the `[type]` segment is the
 * type's URL base segment — e.g. `/docs/webhooks.md` → `/raw/docs/webhooks`,
 * `/changelog/2026-08-01-faster-builds.md` → `/raw/changelog/2026-08-01-faster-builds`.
 * Registry-driven: every content type gets these for free (its entries are
 * public — same data as the pages and the public content API). Responds
 * `text/markdown` with the entry's `bodyMd`; unknown type or id → 404.
 */
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ type: string; id: string }> },
) {
  const { type: base, id } = await params;
  const type = findContentTypeByBase(base);
  if (!type) return new Response('not found', { status: 404 });

  const entries = await listContent(type);
  const entry = entries.find((e) => type.idFor(e) === id);
  if (!entry) return new Response('not found', { status: 404 });

  const { bodyMd } = entry as { bodyMd: string };
  return new Response(bodyMd, {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
