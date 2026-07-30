import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { findDocPage, getDocPages } from '@/lib/content';
import { pageMeta } from '@/lib/site';

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Empty when the store is unreachable (e.g. credential-less builds) —
  // slugs then render on demand at runtime.
  return (await getDocPages()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await findDocPage(slug);
  if (!page) return { title: 'Docs — White Ghost' };
  return pageMeta({
    title: `${page.title} — White Ghost docs`,
    description: page.description ?? `${page.title} on the White Ghost platform, explained.`,
    path: `/docs/${page.slug}`,
  });
}

/** One docs topic — renders the registry entry with the topic sidebar. */
export default async function DocsPage({ params }: Props) {
  const { slug } = await params;
  const [page, docPages] = await Promise.all([findDocPage(slug), getDocPages()]);

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
