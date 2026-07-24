import { timingSafeEqual } from 'node:crypto';

/**
 * Bearer-token gate for content writes. The token is the single write
 * credential for the whole content system (`MARKETING_CONTENT_TOKEN`; prod
 * value lives in the platform secret store, wired in M4). No token in the
 * environment → publishing is disabled entirely.
 */
export type AuthResult = 'ok' | 'unauthorized' | 'disabled';

export function checkWriteAuth(req: Request): AuthResult {
  const token = process.env.MARKETING_CONTENT_TOKEN;
  if (!token) return 'disabled';
  const match = /^Bearer (.+)$/.exec(req.headers.get('authorization') ?? '');
  if (!match) return 'unauthorized';
  const presented = Buffer.from(match[1]);
  const expected = Buffer.from(token);
  if (presented.length !== expected.length) return 'unauthorized';
  return timingSafeEqual(presented, expected) ? 'ok' : 'unauthorized';
}
