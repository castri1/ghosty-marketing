import { CONTENT_TYPES, type ContentType } from '@/lib/content-types';
import { listContent } from '@/lib/content';
import { GLOSSARY } from '@/lib/glossary';
import { siteUrl } from '@/lib/site';
import { consoleUrl } from '@/lib/console-url';

export const revalidate = 300;

/**
 * /llms-full.txt: the expanded companion to /llms.txt per the llms.txt
 * convention: instead of linking each entry, it inlines the full text, so an
 * agent can load the whole site's content in one fetch. Registry-driven for
 * content types (every `llmsTxt: true` type contributes its entries' full
 * markdown bodies) plus the repo-committed glossary. All text is
 * user/agent-visible: vendor-free language only (house rule).
 */
export async function GET() {
  const lines: string[] = [
    '# White Ghost (full text)',
    '',
    '> White Ghost is a deployment platform that lets companies give their employees a safe, isolated environment to build and ship internal applications. Builders describe the software their work needs, shape it with the AI coding assistant they already like, and publish it with one CLI — no cloud consoles, credentials, or pipelines.',
    '',
    `- Console (sign in / sign up): ${consoleUrl('/')}`,
    `- Link index for agents: ${siteUrl('/llms.txt')}`,
    '',
    'This file inlines the full text of the glossary and of every published content entry.',
  ];

  lines.push('', '## Glossary', '');
  for (const entry of GLOSSARY) {
    lines.push(`### ${entry.question}`, '', `Canonical URL: ${siteUrl(`/glossary/${entry.slug}`)}`, '', entry.definition, '');
    for (const section of entry.sections) {
      lines.push(`#### ${section.heading}`, '', section.body, '');
    }
  }

  const types = CONTENT_TYPES as readonly unknown[] as readonly ContentType[];
  for (const type of types.filter((t) => t.flags.llmsTxt)) {
    const entries = await listContent(type);
    if (entries.length === 0) continue;
    lines.push('', `## ${type.label}`, '');
    for (const entry of entries) {
      const { title, bodyMd } = entry as { title: string; bodyMd: string };
      lines.push(`### ${title}`, '', `Canonical URL: ${siteUrl(type.pathFor(entry))}`, '', bodyMd.trim(), '');
    }
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
