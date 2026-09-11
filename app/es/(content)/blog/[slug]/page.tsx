import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { blogPath, findBlogPost, findBlogTwin, formatDateEs, getBlogPosts } from '@/lib/content';
import { pageMeta, siteUrl } from '@/lib/site';

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return (await getBlogPosts('es')).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBlogPost(slug, 'es');
  if (!post) return { title: 'Blog — White Ghost' };
  const twin = await findBlogTwin(post);
  return pageMeta({
    title: `${post.title} — White Ghost`,
    description: post.description,
    path: `/es/blog/${post.slug}`,
    locale: 'es',
    ...(twin ? { alternates: { es: `/es/blog/${post.slug}`, en: blogPath(twin) } } : {}),
    type: 'article',
    publishedTime: post.date,
    modifiedTime: post.updatedAt ?? post.date,
    tags: post.tags,
  });
}

/** Una entrada del blog en español: cuerpo más FAQ, con BlogPosting (+ FAQPage) JSON-LD. */
export default async function BlogPostEsPage({ params }: Props) {
  const { slug } = await params;
  const post = await findBlogPost(slug);
  if (!post) redirect('/es/blog');
  if (post.lang !== 'es') redirect(blogPath(post));

  const postingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: siteUrl(`/es/blog/${post.slug}`),
    inLanguage: 'es',
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: { '@type': 'Organization', name: 'White Ghost', url: siteUrl('/es') },
    publisher: { '@type': 'Organization', name: 'White Ghost', url: siteUrl('/') },
    ...(post.tags.length > 0 ? { keywords: post.tags.join(', ') } : {}),
  };

  const faqJsonLd =
    post.faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: post.faq.map((item) => ({
            '@type': 'Question',
            name: item.q,
            acceptedAnswer: { '@type': 'Answer', text: item.a },
          })),
        }
      : null;

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(postingJsonLd) }}
      />
      {faqJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
        />
      )}

      <article className="docs-article">
        <p className="kicker">
          <Link href="/es/blog">Blog</Link> ·{' '}
          <time dateTime={post.date}>{formatDateEs(post.date)}</time>
        </p>
        <h1>{post.title}</h1>
        <p className="lede">{post.description}</p>
        <div className="md-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.faq.length > 0 && (
          <div className="md-prose">
            <h2>Preguntas frecuentes</h2>
            {post.faq.map((item) => (
              <div key={item.q}>
                <h3>{item.q}</h3>
                <p>{item.a}</p>
              </div>
            ))}
          </div>
        )}
      </article>

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
