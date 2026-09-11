import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { formatDateEs, getBlogPosts } from '@/lib/content';
import { pageMeta } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: 'Blog — White Ghost',
  description:
    'Guías prácticas para publicar y compartir las apps, tableros y herramientas que construyes con asistentes de programación con IA.',
  path: '/es/blog',
  locale: 'es',
});

/** Índice del blog en español: entradas con lang = es, de la más nueva a la más vieja. */
export default async function BlogEs() {
  const posts = await getBlogPosts('es');
  return (
    <>
      <header className="docs-hero">
        <p className="kicker reveal">Blog</p>
        <h1 className="reveal d1">
          Publica lo que construyes, <em>mientras importa.</em>
        </h1>
        <p className="lede reveal d2">
          Guías prácticas para publicar, compartir y gobernar el software que construyes con el
          asistente de IA que ya usas.
        </p>
      </header>

      <section className="clog">
        {posts.length === 0 ? (
          <p className="docs-intro">Las primeras entradas vienen en camino.</p>
        ) : (
          posts.map((post) => (
            <article className="clog-entry" key={post.slug}>
              <div className="clog-rail">
                <time dateTime={post.date}>{formatDateEs(post.date)}</time>
              </div>
              <div className="clog-body">
                <h2>
                  <Link href={`/es/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="clog-summary">{post.description}</p>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="closing">
        <GhostMark className="ghost-mark" />
        <h2>¿Lista tu app para ponerse a trabajar?</h2>
        <p>Descríbela, dale forma con tu asistente y publícala con White Ghost.</p>
        <a className="btn" href={consoleUrl('/signup')}>
          Entrar a la beta
        </a>
      </section>
    </>
  );
}
