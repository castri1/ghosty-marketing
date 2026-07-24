/**
 * Seed the content API from a ghosty-repo checkout's markdown:
 *
 *   docs/site/<slug>.md               → PUT /api/content/docs/<slug>
 *   docs/releases/YYYY-MM-DD-<slug>.md → PUT /api/content/changelog/<id>
 *
 * Usage:
 *   MARKETING_CONTENT_TOKEN=… node scripts/seed.ts [path-to-ghosty-checkout]
 *   env: GHOSTY_REPO (fallback for the arg), MARKETING_URL (default http://localhost:3000)
 *
 * Idempotent for what it touches: PUT is an upsert, so re-running re-writes
 * the same entries. It deliberately NEVER deletes destination entries absent
 * from the checkout — pruning live content based on a possibly-partial local
 * checkout would be a data-loss hazard; remove entries explicitly via the
 * API's DELETE. Run by the operator in OPS O1 against the live service (see
 * ghosty runbook 13); usable any time against a local dev server.
 * Requires Node >= 23.6 (runs TypeScript natively; see package.json engines).
 */
import fs from 'node:fs';
import path from 'node:path';
import { parseFrontmatter } from '../lib/frontmatter.ts';

const repo = process.argv[2] ?? process.env.GHOSTY_REPO;
const target = (process.env.MARKETING_URL ?? 'http://localhost:3000').replace(/\/+$/, '');
const token = process.env.MARKETING_CONTENT_TOKEN;

if (!repo || !fs.existsSync(repo)) {
  console.error('usage: MARKETING_CONTENT_TOKEN=… node scripts/seed.ts <path-to-ghosty-checkout>');
  process.exit(1);
}
if (!token) {
  console.error('MARKETING_CONTENT_TOKEN is required');
  process.exit(1);
}

const RELEASE_FILE = /^(\d{4}-\d{2}-\d{2})-(.+)\.md$/;

interface Upsert {
  type: string;
  id: string;
  entry: Record<string, unknown>;
}

function docsUpserts(): Upsert[] {
  const dir = path.join(repo!, 'docs', 'site');
  return fs
    .readdirSync(dir)
    .filter((name) => name.endsWith('.md') && name.toUpperCase() !== 'README.MD')
    .map((name) => {
      const { meta, body } = parseFrontmatter(fs.readFileSync(path.join(dir, name), 'utf8'));
      const slug = name.replace(/\.md$/, '');
      const order =
        meta.order && Number.isFinite(Number(meta.order)) ? Number(meta.order) : 999;
      return {
        type: 'docs',
        id: slug,
        entry: {
          slug,
          title: meta.title || slug,
          ...(meta.description ? { description: meta.description } : {}),
          order,
          bodyMd: body,
        },
      };
    });
}

function changelogUpserts(): Upsert[] {
  const dir = path.join(repo!, 'docs', 'releases');
  return fs
    .readdirSync(dir)
    .map((name) => ({ name, match: RELEASE_FILE.exec(name) }))
    .filter((f): f is { name: string; match: RegExpExecArray } => f.match !== null)
    .map(({ name, match }) => {
      const { meta, body } = parseFrontmatter(fs.readFileSync(path.join(dir, name), 'utf8'));
      const slug = match[2];
      const date = meta.date || match[1];
      return {
        type: 'changelog',
        id: `${date}-${slug}`,
        entry: {
          slug,
          date,
          title: meta.title || slug,
          ...(meta.summary ? { summary: meta.summary } : {}),
          bodyMd: body,
        },
      };
    });
}

const upserts = [...docsUpserts(), ...changelogUpserts()];
let failures = 0;

for (const { type, id, entry } of upserts) {
  const res = await fetch(`${target}/api/content/${type}/${id}`, {
    method: 'PUT',
    headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
    body: JSON.stringify(entry),
  });
  if (res.ok) {
    console.log(`ok   ${type}/${id}`);
  } else {
    failures += 1;
    console.error(`FAIL ${type}/${id} → ${res.status} ${await res.text()}`);
  }
}

console.log(`seeded ${upserts.length - failures}/${upserts.length} entries to ${target}`);
if (failures > 0) process.exit(1);
