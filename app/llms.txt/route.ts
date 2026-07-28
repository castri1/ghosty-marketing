import { CONTENT_TYPES, type ContentType } from '@/lib/content-types';
import { listContent } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import { consoleUrl } from '@/lib/console-url';

export const revalidate = 300;

/**
 * /llms.txt — the machine-readable site index for AI agents, following the
 * llms.txt convention (markdown: H1, blockquote summary, link sections).
 * Registry-driven: every content type with `llmsTxt: true` contributes a
 * section listing title + canonical URL + raw-markdown URL per entry —
 * adding a content type needs zero code here. All text is user/agent-visible:
 * vendor-free language only (house rule).
 */
export async function GET() {
  const lines: string[] = [
    '# Ghosty',
    '',
    '> Ghosty is a deployment platform that lets companies give their employees a safe, isolated environment to build and ship internal applications. Builders describe the software their work needs, shape it with the AI coding assistant they already like, and publish it with one CLI — no cloud consoles, credentials, or pipelines.',
    '',
    `- Console (sign in / sign up): ${consoleUrl('/')}`,
    `- Docs: ${siteUrl('/docs')}`,
    `- Changelog: ${siteUrl('/changelog')}`,
    '',
    'Every entry below links its web page and its raw-markdown version (append `.md` to the entry URL).',
  ];

  const types = CONTENT_TYPES as readonly unknown[] as readonly ContentType[];
  for (const type of types.filter((t) => t.flags.llmsTxt)) {
    const entries = await listContent(type);
    if (entries.length === 0) continue;
    lines.push('', `## ${type.label}`, '');
    for (const entry of entries) {
      const { title, description, summary } = entry as {
        title: string;
        description?: string;
        summary?: string;
      };
      const note = description ?? summary;
      const rawUrl = siteUrl(`${type.urlBase}/${type.idFor(entry)}.md`);
      lines.push(
        `- [${title}](${siteUrl(type.pathFor(entry))})${note ? `: ${note}` : ''} — raw markdown: ${rawUrl}`,
      );
    }
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
