/**
 * Minimal `--- key: value ---` frontmatter parser (flat string values only,
 * plus folded continuation lines) — the contract from ghosty
 * `docs/releases/README.md`. Ported from the console's marketing/content.ts;
 * used by scripts/seed.ts when importing repo markdown. Kept dependency-free
 * so `node scripts/seed.ts` runs without a build step.
 *
 * CAS-97 fix over the verbatim port: indented lines continue the previous
 * key's value (YAML folded style — several real release entries wrap their
 * `summary` across lines; the console parser silently dropped the overflow,
 * truncating summaries mid-sentence).
 */

export interface Parsed {
  meta: Record<string, string>;
  body: string;
}

export function parseFrontmatter(raw: string): Parsed {
  const match = /^---\r?\n([\s\S]*?)\r?\n---\r?\n?/.exec(raw);
  if (!match) return { meta: {}, body: raw };
  const meta: Record<string, string> = {};
  let lastKey: string | undefined;
  for (const line of match[1].split(/\r?\n/)) {
    if (/^\s/.test(line) && lastKey !== undefined) {
      const cont = line.trim();
      if (cont) meta[lastKey] = meta[lastKey] ? `${meta[lastKey]} ${cont}` : cont;
      continue;
    }
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line
      .slice(idx + 1)
      .trim()
      .replace(/^["']|["']$/g, '');
    if (key) {
      meta[key] = value;
      lastKey = key;
    }
  }
  return { meta, body: raw.slice(match[0].length) };
}
