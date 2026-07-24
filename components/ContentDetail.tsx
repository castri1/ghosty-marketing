/**
 * Default detail view for a registry content-type entry — the starting point
 * the add-a-content-type checklist in CLAUDE.md composes. `html` must come
 * from lib/content.ts's `render()` over store content: the content store is
 * writable only via the bearer-token API (trusted authors), which is what
 * makes dangerouslySetInnerHTML acceptable here.
 */
export function ContentDetail({
  title,
  lede,
  html,
}: {
  title: string;
  lede?: string;
  html: string;
}) {
  return (
    <article className="docs-article">
      <p className="kicker">{title}</p>
      {lede && <p className="lede">{lede}</p>}
      <div className="md-prose" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
