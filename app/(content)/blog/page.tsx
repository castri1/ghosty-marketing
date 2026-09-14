import type { Metadata } from 'next';
import Link from 'next/link';
import { GhostMark } from '@/components/GhostMark';
import { signupUrl } from '@/lib/console-url';
import { formatReleaseDate, getBlogPosts } from '@/lib/content';
import { pageMeta } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: 'Blog — White Ghost',
  description:
    'Practical guides on deploying and sharing the apps, dashboards, and tools you build with AI coding assistants.',
  path: '/blog',
  locale: 'en',
});

/** Blog index — renders the blog registry entries newest-first. */
export default async function Blog() {
  const posts = await getBlogPosts('en');
  return (
    <>
      <header className="docs-hero">
        <p className="kicker reveal">Blog</p>
        <h1 className="reveal d1">
          Ship what you build, <em>while it matters.</em>
        </h1>
        <p className="lede reveal d2">
          Practical guides on deploying, sharing, and governing the software you build with the AI
          assistant you already like.
        </p>
      </header>

      <section className="clog">
        {posts.length === 0 ? (
          <p className="docs-intro">First posts are on their way.</p>
        ) : (
          posts.map((post) => (
            <article className="clog-entry" key={post.slug}>
              <div className="clog-rail">
                <time dateTime={post.date}>{formatReleaseDate(post.date)}</time>
              </div>
              <div className="clog-body">
                <h2>
                  <Link href={`/blog/${post.slug}`}>{post.title}</Link>
                </h2>
                <p className="clog-summary">{post.description}</p>
              </div>
            </article>
          ))
        )}
      </section>

      <section className="closing">
        <GhostMark className="ghost-mark" />
        <h2>Ready to put your app to work?</h2>
        <p>Describe it, shape it with your assistant, and publish it with White Ghost.</p>
        <a className="btn" href={signupUrl('blog')}>
          Start free
        </a>
      </section>
    </>
  );
}
