/**
 * Minimal `--- key: value ---` frontmatter parser (flat string values only) —
 * the contract from ghosty `docs/releases/README.md`. Ported verbatim from
 * the console's marketing/content.ts; used by scripts/seed.ts when importing
 * repo markdown. Kept dependency-free so `node scripts/seed.ts` runs without
 * a build step.
 */

export interface Parsed {
  meta: Record<string, string>;
  body: string;
}

export function parseFrontmatter(raw: string): Parsed {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key) meta[key] = value;
  }
  return { meta, body: raw.slice(match[0].length) };
}
