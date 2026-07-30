import type { Metadata } from 'next';
import { GhostMark } from '@/components/GhostMark';
import { consoleUrl } from '@/lib/console-url';
import { formatReleaseDate, getReleases } from '@/lib/content';
import { pageMeta } from '@/lib/site';

export const revalidate = 300;

export const metadata: Metadata = pageMeta({
  title: 'Changelog — White Ghost',
  description:
    'What shipped on the White Ghost platform: new capabilities, improvements, and fixes, release by release.',
  path: '/changelog',
});

/** Public release notes — renders the changelog registry entries newest-first. */
export default async function Changelog() {
  const releases = await getReleases();
  return (
    <>
      <header className="docs-hero">
        <p className="kicker reveal">Changelog</p>
        <h1 className="reveal d1">
          The platform, <em>improving.</em>
        </h1>
        <p className="lede reveal d2">
          Every release that reaches your apps, in plain language. New capabilities land here the
          day they go live.
        </p>
      </header>

      <section className="clog">
        {releases.length === 0 ? (
          <p className="docs-intro">First release notes are on their way.</p>
        ) : (
          releases.map((entry) => (
            <article className="clog-entry" key={`${entry.date}-${entry.slug}`} id={entry.slug}>
              <div className="clog-rail">
                <time dateTime={entry.date}>{formatReleaseDate(entry.date)}</time>
              </div>
              <div className="clog-body">
                <h2>{entry.title}</h2>
                {entry.summary && <p className="clog-summary">{entry.summary}</p>}
                <div className="md-prose" dangerouslySetInnerHTML={{ __html: entry.html }} />
              </div>
            </article>
          ))
        )}
      </section>

      <section className="closing">
        <GhostMark className="ghost-mark" />
        <h2>Want these in your console?</h2>
        <p>Everything above is live for every White Ghost app, automatically.</p>
        <a className="btn" href={consoleUrl('/signup')}>
          Sign up — it&apos;s free
        </a>
      </section>
    </>
  );
}
