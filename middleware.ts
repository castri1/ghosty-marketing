import { NextResponse, type NextRequest } from 'next/server';

/**
 * Two jobs, in order:
 *
 * 1. Host consolidation. The legacy apex `getghosty.dev`, its `www.` and
 *    `www.whiteghost.ai` all reach this same Cloud Run service through the
 *    apex load balancer and used to serve the site with a 200 (canonical tags
 *    pointed home, but search results kept the old host). Every request on one
 *    of those hosts is now a permanent redirect to `https://whiteghost.ai`
 *    with the same path and query, in one hop. `ALT_HOSTS` (comma list) can
 *    override the set at runtime; the canonical host is always removed from it
 *    so a misconfiguration cannot loop. Only marketing hosts are listed here:
 *    the console and customer app domains are other services and never hit
 *    this middleware.
 *
 * 2. Basic Auth gate for /admin (the operator dashboard). Credentials come
 *    from the runtime env `ADMIN_BASIC_AUTH` ("user:pass", Cloud Run secret
 *    `admin-basic-auth` wired in deploy.yml). No env → the dashboard is
 *    disabled (503), never open. Every /admin response is stamped noindex
 *    (belt to robots.ts's suspenders).
 *
 * Edge runtime: no node:crypto here, so the comparison is a constant-time
 * loop over the decoded header.
 */

const CANONICAL_HOST = 'whiteghost.ai';

const ALT_HOSTS = new Set(
  (process.env.ALT_HOSTS ?? 'getghosty.dev,www.getghosty.dev,www.whiteghost.ai')
    .split(',')
    .map((h) => h.trim().toLowerCase())
    .filter(Boolean),
);
ALT_HOSTS.delete(CANONICAL_HOST);

/** The host the visitor typed: forwarded host first, lowercased, no port. */
function requestHost(req: NextRequest): string {
  const raw = req.headers.get('x-forwarded-host') ?? req.headers.get('host') ?? '';
  return raw.split(',')[0].trim().toLowerCase().replace(/:\d+$/, '');
}

function safeEqual(a: string, b: string): boolean {
  const enc = new TextEncoder();
  const ab = enc.encode(a);
  const bb = enc.encode(b);
  let diff = ab.length ^ bb.length;
  const len = Math.max(ab.length, bb.length);
  for (let i = 0; i < len; i++) {
    diff |= (ab[i % ab.length] ?? 0) ^ (bb[i % bb.length] ?? 0);
  }
  return diff === 0;
}

function adminGate(req: NextRequest) {
  const expected = process.env.ADMIN_BASIC_AUTH;
  if (!expected || !expected.includes(':')) {
    return new NextResponse('admin is not configured', {
      status: 503,
      headers: { 'X-Robots-Tag': 'noindex' },
    });
  }

  const header = req.headers.get('authorization') ?? '';
  const match = /^Basic (.+)$/.exec(header);
  let presented = '';
  if (match) {
    try {
      presented = atob(match[1]);
    } catch {
      presented = '';
    }
  }

  if (!presented || !safeEqual(presented, expected)) {
    return new NextResponse('authentication required', {
      status: 401,
      headers: {
        'WWW-Authenticate': 'Basic realm="White Ghost admin", charset="UTF-8"',
        'X-Robots-Tag': 'noindex',
      },
    });
  }

  const res = NextResponse.next();
  res.headers.set('X-Robots-Tag', 'noindex');
  return res;
}

export function middleware(req: NextRequest) {
  if (ALT_HOSTS.has(requestHost(req))) {
    const url = req.nextUrl.clone();
    url.protocol = 'https:';
    url.host = CANONICAL_HOST;
    url.port = '';
    const res = NextResponse.redirect(url, 301);
    // Let the apex CDN serve the hop itself; the cache key includes the host,
    // so a cached redirect for an alternate host never leaks to the canonical one.
    res.headers.set('Cache-Control', 'public, max-age=86400');
    return res;
  }

  const { pathname } = req.nextUrl;
  if (pathname === '/admin' || pathname.startsWith('/admin/')) return adminGate(req);
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
