import { NextResponse } from 'next/server';
import { checkWriteAuth } from '@/lib/content-auth';
import { findMetricKind, METRICS_COLLECTION } from '@/lib/metrics-types';
import { getDb } from '@/lib/firestore';

/**
 * /api/metrics/:kind — operator-only list. Unlike /api/content, GET is also
 * token-gated: metrics are dashboard data, not public content. Sorted by id
 * (date / ISO week) descending.
 */

type Params = { params: Promise<{ kind: string }> };

function unauthorized(result: 'unauthorized' | 'disabled') {
  return result === 'disabled'
    ? NextResponse.json({ error: 'metrics are not configured' }, { status: 503 })
    : NextResponse.json({ error: 'unauthorized' }, { status: 401 });
}

export async function GET(req: Request, { params }: Params) {
  const { kind: key } = await params;
  const kind = findMetricKind(key);
  if (!kind) return NextResponse.json({ error: 'unknown metric kind' }, { status: 404 });

  const auth = checkWriteAuth(req);
  if (auth !== 'ok') return unauthorized(auth);

  const snap = await getDb().collection(METRICS_COLLECTION).where('kind', '==', kind.key).get();
  const items = snap.docs
    .map((doc) => doc.data())
    .sort((a, b) => String(b.id).localeCompare(String(a.id)));
  return NextResponse.json({ items });
}
