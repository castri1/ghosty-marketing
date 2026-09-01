import { NextResponse } from 'next/server';
import { checkWriteAuth } from '@/lib/content-auth';
import { findMetricKind, METRICS_COLLECTION } from '@/lib/metrics-types';
import { getDb } from '@/lib/firestore';

/**
 * /api/metrics/:kind/:id — single-entry metrics API (operator-only; every
 * verb requires the bearer token, GET included — metrics are dashboard
 * data, not public content).
 *   PUT    upsert — body validated with the kind's strict schema; the id
 *          must equal the kind's canonical id for the body; `kind`, `id`
 *          and `updatedAt` are server-stamped
 *   DELETE remove
 * Document id in Firestore: `<kind>-<id>`.
 */

type Params = { params: Promise<{ kind: string; id: string }> };

function unauthorized(result: 'unauthorized' | 'disabled') {
  return result === 'disabled'
    ? NextResponse.json({ error: 'metrics are not configured' }, { status: 503 })
    : NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

export async function GET(req: Request, { params }: Params) {
  const { kind: key, id } = await params;
  const kind = findMetricKind(key);
  if (!kind) return NextResponse.json({ error: 'unknown metric kind' }, { status: 404 });

  const auth = checkWriteAuth(req);
  if (auth !== 'ok') return unauthorized(auth);

  const doc = await getDb().collection(METRICS_COLLECTION).doc(`${kind.key}-${id}`).get();
  if (!doc.exists) return NextResponse.json({ error: 'not found' }, { status: 404 });
  return NextResponse.json(doc.data());
}

export async function PUT(req: Request, { params }: Params) {
  const { kind: key, id } = await params;
  const kind = findMetricKind(key);
  if (!kind) return NextResponse.json({ error: 'unknown metric kind' }, { status: 404 });

  const auth = checkWriteAuth(req);
  if (auth !== 'ok') return unauthorized(auth);

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'body must be JSON' }, { status: 400 });
  }

  const parsed = kind.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'invalid entry', issues: parsed.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`) },
      { status: 400 },
    );
  }

  const canonicalId = kind.idFor(parsed.data);
  if (canonicalId !== id) {
    return NextResponse.json({ error: `id mismatch: body maps to "${canonicalId}"` }, { status: 400 });
  }

  const stored = { ...parsed.data, kind: kind.key, id, updatedAt: new Date().toISOString() };
  await getDb().collection(METRICS_COLLECTION).doc(`${kind.key}-${id}`).set(stored);
  return NextResponse.json(stored);
}

export async function DELETE(req: Request, { params }: Params) {
  const { kind: key, id } = await params;
  const kind = findMetricKind(key);
  if (!kind) return NextResponse.json({ error: 'unknown metric kind' }, { status: 404 });

  const auth = checkWriteAuth(req);
  if (auth !== 'ok') return unauthorized(auth);

  const ref = getDb().collection(METRICS_COLLECTION).doc(`${kind.key}-${id}`);
  if (!(await ref.get()).exists) return NextResponse.json({ error: 'not found' }, { status: 404 });
  await ref.delete();
  return NextResponse.json({ deleted: id });
}
