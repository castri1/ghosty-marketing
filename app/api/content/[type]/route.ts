import { NextResponse } from 'next/server';
import { findContentType } from '@/lib/content-types';
import { getDb } from '@/lib/firestore';

/**
 * GET /api/content/:type — public list of a content type's entries, sorted.
 * API reads go straight to the store (always fresh — automation-facing);
 * the cached layer in lib/content.ts is for pages only.
 */
export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type: key } = await params;
  const type = findContentType(key);
  if (!type) return NextResponse.json({ error: 'unknown content type' }, { status: 404 });

  const snap = await getDb().collection(type.collection).get();
  const items = snap.docs
    .map((d) => d.data())
    .filter((d) => type.schema.safeParse(d).success)
    .sort((a, b) => type.compare(a, b));
  return NextResponse.json({ items });
}
