import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { findBlogPost, formatReleaseDate, getBlogPosts } from '@/lib/content';
import { pageMeta, siteUrl } from '@/lib/site';

export const revalidate = 300;

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  // Empty when the store is unreachable (e.g. credential-less builds) —
  // slugs then render on demand at runtime.
  return (await getBlogPosts()).map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await findBlogPost(slug);
  if (!post) return { title: 'Blog — Ghosty' };
  return pageMeta({
    title: `${post.title} — Ghosty`,
    description: post.description,
    path: `/blog/${post.slug}`,
  });
}

/** One blog post — entry body plus FAQ, with BlogPosting (+ FAQPage) JSON-LD. */
export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await findBlogPost(slug);
  if (!post) redirect('/blog');

  const postingJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.description,
    url: siteUrl(`/blog/${post.slug}`),
    datePublished: post.date,
    dateModified: post.updatedAt ?? post.date,
    author: { '@type': 'Organization', name: 'Ghosty', url: siteUrl('/') },
    publisher: { '@type': 'Organization', name: 'Ghosty', url: siteUrl('/') },
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
          <Link href="/blog">Blog</Link> ·{' '}
          <time dateTime={post.date}>{formatReleaseDate(post.date)}</time>
        </p>
        <h1>{post.title}</h1>
        <p className="lede">{post.description}</p>
        <div className="md-prose" dangerouslySetInnerHTML={{ __html: post.html }} />

        {post.faq.length > 0 && (
          <div className="md-prose">
            <h2>Frequently asked questions</h2>
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
        <h2>Ready to put your app to work?</h2>
        <p>Describe it, shape it with your assistant, and publish it with Ghosty.</p>
        <a className="btn" href={consoleUrl('/signup')}>
          Join the beta
        </a>
      </section>
    </>
  );
}
