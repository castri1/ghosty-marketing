import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { checkWriteAuth } from '@/lib/content-auth';
import { findContentType } from '@/lib/content-types';
import { getDb } from '@/lib/firestore';

/**
 * /api/content/:type/:id — single-entry API.
 *   GET    public read (fresh, straight from the store)
 *   PUT    upsert — bearer `MARKETING_CONTENT_TOKEN`; body validated with the
 *          type's schema; `updatedAt` server-stamped; id must equal the
 *          type's canonical id for the body
 *   DELETE remove — same auth
 * Writes invalidate the type's cache tag so pages refresh immediately.
 */

type Params = { params: Promise<{ type: string; id: string }> };

function unauthorized(result: 'unauthorized' | 'disabled') {
  return result === 'disabled'
    ? NextResponse.json({ error: 'content publishing is not configured' }, { status: 503 })
    : NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

export async function GET(_req: Request, { params }: Params) {
  const { type: key, id } = await params;
  const type = findContentType(key);
  if (!type) return NextResponse.json({ error: 'unknown content type' }, { status: 404 });

  const doc = await getDb().collection(type.collection).doc(id).get();
  if (!doc.exists) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(doc.data());
}

export async function PUT(req: Request, { params }: Params) {
  const { type: key, id } = await params;
  const type = findContentType(key);
  if (!type) return NextResponse.json({ error: 'unknown content type' }, { status: 404 });

  const auth = checkWriteAuth(req);
  if (auth !== 'ok') return unauthorized(auth);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'body must be JSON' }, { status: 400 });
  }

  const parsed = type.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid entry', issues: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`) },
      { status: 400 },
    );
  }

  const canonicalId = type.idFor(parsed.data);
  if (canonicalId !== id) {
    return NextResponse.json(
      { error: `id mismatch: body maps to "${canonicalId}"` },
      { status: 400 },
    );
  }

  const stored = { ...parsed.data, updatedAt: new Date().toISOString() };
  await getDb().collection(type.collection).doc(id).set(stored);
  revalidateTag(type.key);
  return NextResponse.json(stored);
}

export async function DELETE(req: Request, { params }: Params) {
  const { type: key, id } = await params;
  const type = findContentType(key);
  if (!type) return NextResponse.json({ error: 'unknown content type' }, { status: 404 });

  const auth = checkWriteAuth(req);
  if (auth !== 'ok') return unauthorized(auth);

  const ref = getDb().collection(type.collection).doc(id);
  if (!(await ref.get()).exists) return NextResponse.json({ error: 'not found' }, { status: 404 });
  await ref.delete();
  revalidateTag(type.key);
  return NextResponse.json({ deleted: id });
}
