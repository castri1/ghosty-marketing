import { NextResponse, type NextRequest } from 'next/server';

/**
 * Basic Auth gate for /admin (the operator dashboard). Credentials come from
 * the runtime env `ADMIN_BASIC_AUTH` ("user:pass", Cloud Run secret
 * `admin-basic-auth` wired in deploy.yml). No env → the dashboard is
 * disabled (503), never open. Every /admin response is stamped noindex
 * (belt to robots.ts's suspenders).
 *
 * Edge runtime: no node:crypto here, so the comparison is a constant-time
 * loop over the decoded header.
 */

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

export function middleware(req: NextRequest) {
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

export const config = {
  matcher: ['/admin/:path*', '/admin'],
};
