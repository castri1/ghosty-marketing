import type { Metadata } from 'next';
import Link from 'next/link';
import { GLOSSARY } from '@/lib/glossary';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: 'Glossary — Ghosty',
  description:
    'Plain-language definitions of the terms around building and deploying software with AI: shadow AI, vibe coding, BYOC, MCP servers.',
  path: '/glossary',
});

/** Glossary index — answer-first definitions, one page per term. */
export default function Glossary() {
  return (
    <>
      <header className="docs-hero">
        <p className="kicker reveal">Glossary</p>
        <h1 className="reveal d1">
          The words around <em>building with AI.</em>
        </h1>
        <p className="lede reveal d2">
          Plain-language definitions, written to answer the question in the first line.
        </p>
      </header>

      <section className="clog">
        {GLOSSARY.map((entry) => (
          <article className="clog-entry" key={entry.slug}>
            <div className="clog-body">
              <h2>
                <Link href={`/glossary/${entry.slug}`}>{entry.question}</Link>
              </h2>
              <p className="clog-summary">{entry.definition}</p>
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
