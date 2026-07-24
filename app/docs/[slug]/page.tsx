import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { docPages, findDocPage } from '@/lib/content';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return docPages.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = findDocPage(slug);
  if (!page) return { title: 'Docs — Ghosty' };
  return {
    title: `${page.title} — Ghosty docs`,
    ...(page.description ? { description: page.description } : {}),
  };
}

/** One docs topic — renders fixtures/site/<slug>.md with the topic sidebar. */
export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const page = findDocPage(slug);

  if (!page) redirect('/docs');

  return (
    <div className="docs-grid">
      <aside className="docs-side">
        <p className="docs-side-label">Docs</p>
        <nav>
          <Link href="/docs">Quickstart</Link>
          {docPages.map((p) => (
            <Link
              key={p.slug}
              href={`/docs/${p.slug}`}
              className={p.slug === page.slug ? 'active' : undefined}
              aria-current={p.slug === page.slug ? 'page' : undefined}
            >
              {p.title}
            </Link>
          ))}
        </nav>
      </aside>

      <article className="docs-article">
        <p className="kicker">{page.title}</p>
        {page.description && <p className="lede">{page.description}</p>}
        <div className="md-prose" dangerouslySetInnerHTML={{ __html: page.html }} />
      </article>
    </div>
  );
}
