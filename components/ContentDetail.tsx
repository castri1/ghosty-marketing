/**
 * Default detail view for a registry content-type entry — the starting point
 * the add-a-content-type checklist in CLAUDE.md composes. `html` must come
 * from lib/content.ts's `render()` over store content: the content store is
 * writable only via the bearer-token API (trusted authors), which is what
 * makes dangerouslySetInnerHTML acceptable here. The title is the page's H1
 * (styled as the kicker); pass `html` rendered from `stripLeadingH1(bodyMd)`
 * when the markdown may open with its own `# ` heading.
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
      <h1 className="kicker">{title}</h1>
      {lede && <p className="lede">{lede}</p>}
      <div className="md-prose" dangerouslySetInnerHTML={{ __html: html }} />
    </article>
  );
}
