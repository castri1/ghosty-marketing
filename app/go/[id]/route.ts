import { FieldPath, FieldValue } from '@google-cloud/firestore';
import { getDb } from '@/lib/firestore';
import { LINKS_COLLECTION, dayKey, isLinkId, settleWithin, shouldCountClick, withUtms } from '@/lib/links';

/**
 * /go/:id — tracked short link (lib/links.ts). 302 to the link's target with
 * its campaign tags appended; an unknown or malformed id 302s home, so a typo
 * in a post never shows an error page.
 *
 * Counting: only a GET from a browser increments `clicks` and today's (UTC)
 * `clicks_by_day` entry. HEAD (link and mail scanners probe with it — Next
 * answers it with this GET handler, `req.method` still says HEAD) and
 * link-preview fetchers / crawlers / speculative loads never count. Nothing
 * about the visitor is stored — no address, no user agent.
 *
 * The redirect awaits the click write (Cloud Run throttles CPU once the
 * response is sent, so a write left behind can stall and be lost), capped at
 * COUNT_WAIT_MS so a stuck store never holds the visitor for long. Hitting
 * the cap logs one warning — a possibly lost count is never silent. A failed
 * write is logged by its one error handler.
 *
 * `private, no-store` on every answer: the apex CDN honors origin headers, and
 * a cached redirect would swallow every click after the first.
 */

export const dynamic = 'force-dynamic';

const COUNT_WAIT_MS = 1500;

type Params = { params: Promise<{ id: string }> };

const NO_STORE = { 'Cache-Control': 'private, no-store', 'X-Robots-Tag': 'noindex' };

function redirectTo(location: string): Response {
  return new Response(null, { status: 302, headers: { ...NO_STORE, Location: location } });
}

function errorText(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export async function GET(req: Request, { params }: Params): Promise<Response> {
  const { id } = await params;
  if (!isLinkId(id)) return redirectTo('/');

  const ref = getDb().collection(LINKS_COLLECTION).doc(id);
  let data: Record<string, unknown> | undefined;
  try {
    const snap = await ref.get();
    data = snap.exists ? snap.data() : undefined;
  } catch (err) {
    console.error(`go: lookup failed for ${id}: ${errorText(err)}`);
    return redirectTo('/');
  }
  if (!data) return redirectTo('/');

  const location = typeof data.target === 'string' ? withUtms(data.target, data) : null;
  if (!location) return redirectTo('/');

  if (shouldCountClick(req.method, req.headers)) {
    // FieldPath, not a dotted string: the day key is one map key. The
    // .catch is the write's only error handler; a failed count never blocks
    // the visitor.
    const counting = ref
      .update('clicks', FieldValue.increment(1), new FieldPath('clicks_by_day', dayKey(new Date())), FieldValue.increment(1))
      .catch((err: unknown) => console.error(`go: count failed for ${id}: ${errorText(err)}`));
    if (!(await settleWithin(counting, COUNT_WAIT_MS))) {
      console.warn(`go: ${id} click write still pending at redirect`);
    }
  }

  return redirectTo(location);
}
