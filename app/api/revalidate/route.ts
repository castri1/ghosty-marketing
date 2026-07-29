import { revalidateTag } from 'next/cache';
import { NextResponse } from 'next/server';
import { checkWriteAuth } from '@/lib/content-auth';
import { CONTENT_TYPES } from '@/lib/content-types';

/**
 * POST /api/revalidate — invalidate every registry type's cache tag (CAS-126).
 *
 * Same bearer gate as content writes (`MARKETING_CONTENT_TOKEN`). Exists for
 * the on-boot self-call in `instrumentation.ts`: the deploy image bakes the
 * credential-less build's empty prerender + data cache, so every fresh server
 * instance starts stale; revalidating all tags on boot makes it converge on
 * the store immediately instead of after up to two 300s ISR windows. Also
 * callable by operators/automation as a manual "refresh everything".
 */
export async function POST(req: Request) {
  const auth = checkWriteAuth(req);
  if (auth === 'disabled') {
    return NextResponse.json({ error: 'content publishing is not configured' }, { status: 503 });
  }
  if (auth !== 'ok') {
    return NextResponse.json({ error: 'unauthorized' }, { status: 401 });
  }
  for (const type of CONTENT_TYPES) revalidateTag(type.key);
  return NextResponse.json({ revalidated: CONTENT_TYPES.map((t) => t.key) });
}
