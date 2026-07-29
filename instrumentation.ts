import { CONTENT_TYPES } from '@/lib/content-types';

/**
 * On-boot cache revalidation (CAS-126).
 *
 * The deploy image is built with no store credentials, so the build-time
 * prerender AND the data cache entries baked into `.next` are empty. Every
 * fresh server instance (new deploy, scale-out, cold start) therefore serves
 * empty index pages until the layered ISR windows expire — up to ~2×300s.
 *
 * Fix: when a server instance boots, self-call `POST /api/revalidate` (which
 * `revalidateTag`s every registry type) with the instance's own
 * `MARKETING_CONTENT_TOKEN`, then warm-fetch each type's list page so even
 * the first visitor gets a fresh cached render. Runs as a background retry
 * loop — `register()` must not block the server from listening (the self-call
 * can only succeed once the port is open).
 *
 * This is per-instance by design: a CI-called revalidate would only heal the
 * one instance that receives the call (and would need the deployer to hold
 * the content token). No token in the environment → skipped (matches the
 * content API's "publishing disabled" posture; nothing can have been
 * published beyond what the build saw).
 */
export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== 'nodejs') return;
  if (process.env.NEXT_PHASE === 'phase-production-build') return;

  const token = process.env.MARKETING_CONTENT_TOKEN;
  if (!token) {
    console.warn('[boot-revalidate] no MARKETING_CONTENT_TOKEN — skipping boot revalidation');
    return;
  }

  const origin = `http://127.0.0.1:${process.env.PORT ?? '3000'}`;

  // Deliberately not awaited — see the header comment.
  void (async () => {
    const maxAttempts = 60;
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      try {
        const res = await fetch(`${origin}/api/revalidate`, {
          method: 'POST',
          headers: { authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          console.log('[boot-revalidate] revalidated all content tags');
          // Warm the list pages so the first visitor gets a fresh cached
          // render instead of paying the re-render.
          for (const type of CONTENT_TYPES) {
            await fetch(`${origin}${type.urlBase}`).catch(() => undefined);
          }
          return;
        }
        console.warn(`[boot-revalidate] attempt ${attempt}: HTTP ${res.status}`);
      } catch {
        // Server not listening yet (or transient) — retry.
      }
    }
    console.error(
      `[boot-revalidate] gave up after ${maxAttempts} attempts — index pages may serve stale content until ISR converges`,
    );
  })();
}
