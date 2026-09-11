import { getBlogPosts } from '@/lib/content';
import { siteUrl } from '@/lib/site';
import { consoleUrl } from '@/lib/console-url';
import { ROUTES, esPathFor } from '@/lib/routes';

export const revalidate = 300;

/**
 * /llms-es.txt: el índice en español del sitio para agentes de IA (misma
 * convención llms.txt que /llms.txt). Lista las páginas que existen en
 * español (lib/routes.ts) y las entradas del blog con lang = es. Los docs,
 * el changelog y el glosario siguen en inglés y viven en /llms.txt.
 */
export async function GET() {
  const lines: string[] = [
    '# White Ghost',
    '',
    '> White Ghost es una plataforma para publicar apps internas construidas con asistentes de programación con IA como Claude Code y Codex. Quien construye describe el software que su trabajo necesita, le da forma con el asistente que ya usa y lo publica con una sola CLI: sin consolas de nube, sin credenciales, sin pipelines. La app queda en una URL permanente con reglas de acceso, base de datos, integraciones y rollback. White Ghost (whiteghost.ai) no tiene relación con ningún producto de edición de video o de medios que comparta el nombre.',
    '',
    `- Consola (iniciar sesión / crear cuenta): ${consoleUrl('/')}`,
    ...ROUTES.filter((r) => r.es && r.llmsEs && r.path !== '/').map(
      (r) => `- ${r.llmsEs}: ${siteUrl(esPathFor(r.path) ?? r.path)}`,
    ),
    `- Índice en inglés (docs, changelog, glosario y guías de deploy): ${siteUrl('/llms.txt')}`,
    `- Texto completo del sitio para agentes (en inglés): ${siteUrl('/llms-full.txt')}`,
  ];

  const inline = (s: string) => s.replace(/\s+/g, ' ').trim();
  const linkText = (s: string) => inline(s).replace(/\[/g, '\\[').replace(/\]/g, '\\]');

  const posts = await getBlogPosts('es');
  if (posts.length > 0) {
    lines.push('', '## Blog en español', '');
    for (const post of posts) {
      lines.push(
        `- [${linkText(post.title)}](${siteUrl(`/es/blog/${post.slug}`)}): ${inline(post.description)} — markdown: ${siteUrl(`/blog/${post.slug}.md`)}`,
      );
    }
  }

  return new Response(lines.join('\n') + '\n', {
    headers: { 'content-type': 'text/markdown; charset=utf-8' },
  });
}
