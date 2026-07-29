import type { Metadata } from 'next';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import { GLOSSARY, getGlossaryEntry } from '@/lib/glossary';
import { pageMeta, siteUrl } from '@/lib/site';

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return GLOSSARY.map((entry) => ({ slug: entry.slug }));
}

export const dynamicParams = false;

// Bounded CDN TTL — see app/page.tsx (CAS-127).
export const revalidate = 3600;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) return { title: 'Glossary — Ghosty' };
  return pageMeta({
    title: `${entry.question} — Ghosty`,
    description: entry.definition.slice(0, 158),
    path: `/glossary/${entry.slug}`,
  });
}

/** One glossary term — DefinedTerm + FAQPage JSON-LD, answer-first body. */
export default async function GlossaryEntryPage({ params }: Props) {
  const { slug } = await params;
  const entry = getGlossaryEntry(slug);
  if (!entry) redirect('/glossary');

  const related = entry.related
    .map((s) => getGlossaryEntry(s))
    .filter((e): e is NonNullable<typeof e> => Boolean(e));

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'DefinedTerm',
      name: entry.term,
      description: entry.definition,
      url: siteUrl(`/glossary/${entry.slug}`),
      inDefinedTermSet: {
        '@type': 'DefinedTermSet',
        name: 'Ghosty glossary',
        url: siteUrl('/glossary'),
      },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [
        {
          '@type': 'Question',
          name: entry.question,
          acceptedAnswer: { '@type': 'Answer', text: entry.definition },
        },
      ],
    },
  ];

  return (
    <>
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}

      <article className="docs-article">
        <p className="kicker">
          <Link href="/glossary">Glossary</Link>
        </p>
        <h1>{entry.question}</h1>
        <p className="lede">{entry.definition}</p>

        <div className="md-prose">
          {entry.sections.map((section) => (
            <div key={section.heading}>
              <h2>{section.heading}</h2>
              <p>{section.body}</p>
            </div>
          ))}

          {related.length > 0 && (
            <>
              <h2>Related terms</h2>
              <ul>
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link href={`/glossary/${r.slug}`}>{r.term}</Link>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      </article>
    </>
  );
}
