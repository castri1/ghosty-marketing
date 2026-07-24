import Link from 'next/link';

export interface ContentListItem {
  slug: string;
  title: string;
  /** Optional one-liner shown under the title. */
  description?: string;
}

/**
 * Default list view for a registry content type — the starting point the
 * add-a-content-type checklist in CLAUDE.md composes (docs/changelog predate
 * it and keep bespoke layouts). Uses the ported `.mkt` marketing classes.
 */
export function ContentList({
  heading,
  lede,
  urlBase,
  items,
  emptyText,
}: {
  heading: string;
  lede?: string;
  urlBase: string;
  items: ContentListItem[];
  emptyText?: string;
}) {
  return (
    <>
      <header className="docs-hero">
        <p className="kicker">{heading}</p>
        <h1>{heading}</h1>
        {lede && <p className="lede">{lede}</p>}
      </header>
      <section>
        {items.length === 0 ? (
          <p className="docs-intro">{emptyText ?? 'Nothing here yet.'}</p>
        ) : (
          <div className="docs-toc guides-toc">
            {items.map((item) => (
              <Link key={item.slug} href={`${urlBase}/${item.slug}`}>
                <span className="docs-toc-text">
                  <strong>{item.title}</strong>
                  {item.description}
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
