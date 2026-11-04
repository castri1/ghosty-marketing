import { NextResponse } from 'next/server';
import { checkWriteAuth } from '@/lib/content-auth';
import { getDb } from '@/lib/firestore';
import {
  GO_PREFIX,
  LINKS_COLLECTION,
  LinkInputSchema,
  isLinkId,
  linkConfig,
  newLinkDoc,
  readStoredLink,
  withUtms,
  type StoredLink,
} from '@/lib/links';
import { siteUrl } from '@/lib/site';

/**
 * /api/links/:id — tracked-link admin (operator-only; every verb requires
 * the content bearer token `MARKETING_CONTENT_TOKEN`, GET included — click
 * counts are dashboard data, not public content).
 *   PUT  create or update — body `{target, utm_source, utm_medium,
 *        utm_campaign, utm_content?}` (strict). An omitted `utm_content` is
 *        the id on create and keeps the stored value on update. Counters and
 *        `createdAt` are server-managed and survive updates. 201 on create,
 *        200 on update.
 *   GET  the link with its counters (`clicks`, `clicks_by_day`).
 * The id is the piece id: `^(x|li|yt)-\d{3,}$`. Links are not a content
 * type (lib/links.ts) — no public read path.
 */

type Params = { params: Promise<{ id: string }> };

function unauthorized(result: 'unauthorized' | 'disabled') {
  return result === 'disabled'
    ? NextResponse.json({ error: 'links are not configured' }, { status: 503 })
    : NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

/** The API view of a link: the stored fields plus its public address and where it lands. */
function view(id: string, link: StoredLink, status = 200) {
  return NextResponse.json(
    { id, url: siteUrl(`${GO_PREFIX}${id}`), redirectsTo: withUtms(link.target, link), ...link },
    { status, headers: { 'Cache-Control': 'private, no-store' } },
  );
}

export async function GET(req: Request, { params }: Params) {
  const { id } = await params;
  const auth = checkWriteAuth(req);
  if (auth !== 'ok') return unauthorized(auth);
  if (!isLinkId(id)) return NextResponse.json({ error: 'not found' }, { status: 404 });

  const snap = await getDb().collection(LINKS_COLLECTION).doc(id).get();
  if (!snap.exists) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return view(id, readStoredLink(snap.data() ?? {}));
}

export async function PUT(req: Request, { params }: Params) {
  const { id } = await params;
  const auth = checkWriteAuth(req);
  if (auth !== 'ok') return unauthorized(auth);
  if (!isLinkId(id)) {
    return NextResponse.json(
      { error: 'invalid id: expected x-NNN, li-NNN or yt-NNN (3+ digits)' },
      { status: 400 },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'body must be JSON' }, { status: 400 });
  }

  const parsed = LinkInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid link', issues: parsed.error.issues.map((i) => `${i.path.join('.') || 'body'}: ${i.message}`) },
      { status: 400 },
    );
  }

  const now = new Date();
  const db = getDb();
  const ref = db.collection(LINKS_COLLECTION).doc(id);
  // Transaction: an update rewrites the editable fields only, so the click
  // counters (incremented concurrently by /go) and createdAt are never reset;
  // an omitted utm_content keeps the stored one (linkConfig).
  const { link, created } = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) {
      const fresh = newLinkDoc(linkConfig(id, parsed.data), now);
      tx.set(ref, fresh);
      return { link: fresh, created: true };
    }
    const stored = readStoredLink(snap.data() ?? {});
    const config = linkConfig(id, parsed.data, stored);
    const updatedAt = now.toISOString();
    tx.update(ref, { ...config, updatedAt });
    return { link: { ...stored, ...config, updatedAt }, created: false };
  });
  return view(id, link, created ? 201 : 200);
}
