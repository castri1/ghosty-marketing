/**
 * Liveness probe — the platform's smoke target for this service after the
 * apex cutover (ghosty repo runbook 13). Static 200 "ok": no store access,
 * no dependencies; it only proves the server process answers.
 */
// Answer live on every probe (never a build-time cached body).
export const dynamic = 'force-dynamic';

export function GET() {
  return new Response('ok', {
    headers: { 'content-type': 'text/plain; charset=utf-8', 'cache-control': 'no-store' },
  });
}
