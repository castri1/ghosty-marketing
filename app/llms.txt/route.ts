import { CONTENT_TYPES, type ContentType } from '@/lib/content-types';
import { listContent } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import { consoleUrl } from '@/lib/console-url';
import { ROUTES } from '@/lib/routes';

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
    '# White Ghost',
    '',
    '> White Ghost is a deployment platform that lets companies give their employees a safe, isolated environment to build and ship internal applications. Builders describe the software their work needs, shape it with the AI coding assistant they already like, and publish it with one CLI — no cloud consoles, credentials, or pipelines. White Ghost (whiteghost.ai) is a deployment platform for apps built with AI coding assistants such as Claude Code and Codex; it is not related to any video-editing or media product that shares the name.',
    '',
    `- Console (sign in / sign up): ${consoleUrl('/')}`,
    ...ROUTES.filter((r) => r.llms && r.path !== '/').map((r) => `- ${r.llms}: ${siteUrl(r.path)}`),
    `- Spanish version of this index: ${siteUrl('/llms-es.txt')} (available once the /es site ships)`,
    `- Full site text for agents: ${siteUrl('/llms-full.txt')}`,
    '',
    'Every entry below links its web page and lists its raw-markdown URL.',
  ];

  // Titles/notes are trusted-author content, but keep the index structurally
  // sound: single line, and no unescaped brackets inside link text.
  const inline = (s: string) => s.replace(/\s+/g, ' ').trim();
  const linkText = (s: string) => inline(s).replace(/\[/g, '\\[').replace(/\]/g, '\\]');

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
        `- [${linkText(title)}](${siteUrl(type.pathFor(entry))})${note ? `: ${inline(note)}` : ''} — raw markdown: ${rawUrl}`,
      );
    }
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
