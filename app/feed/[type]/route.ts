import { findContentType } from '@/lib/content-types';
import { listContent, render } from '@/lib/content';
import { siteUrl } from '@/lib/site';

export const revalidate = 300;

/**
 * Generic RSS 2.0 feed for date-sorted content types with `rss: true`:
 * `/<key>.xml` rewrites here (next.config.mjs) — `/changelog.xml` today;
 * future articles/news types inherit it by flipping the registry flag.
 * Types without the flag (or unknown) → 404. Feed text is user/agent-visible:
 * vendor-free language only (house rule).
 */

function xmlEscape(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function cdata(s: string): string {
  return `<![CDATA[${s.replace(/\]\]>/g, ']]]]><![CDATA[>')}]]>`;
}

export async function GET(_req: Request, { params }: { params: Promise<{ type: string }> }) {
  const { type: key } = await params;
  const type = findContentType(key);
  if (!type || !type.flags.rss) return new Response('not found', { status: 404 });

  const entries = await listContent(type);
  const items = entries
    .map((entry) => {
      const { title, date, summary } = entry as { title: string; date?: string; summary?: string };
      const link = siteUrl(type.pathFor(entry));
      const bodyHtml = render((entry as { bodyMd: string }).bodyMd);
      return [
        '    <item>',
        `      <title>${xmlEscape(title)}</title>`,
        `      <link>${xmlEscape(link)}</link>`,
        `      <guid isPermaLink="false">${xmlEscape(`${type.key}/${type.idFor(entry)}`)}</guid>`,
        ...(date && !Number.isNaN(Date.parse(`${date}T00:00:00Z`))
          ? [`      <pubDate>${new Date(`${date}T00:00:00Z`).toUTCString()}</pubDate>`]
          : []),
        ...(summary ? [`      <description>${xmlEscape(summary)}</description>`] : []),
        `      <content:encoded>${cdata(bodyHtml)}</content:encoded>`,
        '    </item>',
      ].join('\n');
    })
    .join('\n');

  const feedUrl = siteUrl(`/${type.key}.xml`);
  const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">',
    '  <channel>',
    `    <title>Ghosty — ${xmlEscape(type.label)}</title>`,
    `    <link>${xmlEscape(siteUrl(type.urlBase))}</link>`,
    `    <description>${xmlEscape(`${type.label} updates from the Ghosty platform.`)}</description>`,
    '    <language>en</language>',
    `    <atom:link href="${xmlEscape(feedUrl)}" rel="self" type="application/rss+xml"/>`,
    items,
    '  </channel>',
    '</rss>',
    '',
  ].join('\n');

  return new Response(xml, {
    headers: { 'content-type': 'application/rss+xml; charset=utf-8' },
  });
}
