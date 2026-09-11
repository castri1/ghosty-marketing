import { Rise } from "@/components/wg/Rise";
import { PixelEdge, PixelIcon, PX } from "@/components/wg/PixelBits";
import { localizeHref, type Dictionary, type Locale } from '@/lib/i18n';

/** Ported verbatim from the design lab (app/[locale]/compare/stack/page.tsx), bilingual via {dict, locale}. */
export function CompareStackView({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.compareStack;

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.items.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  };

  return (
    <div className="bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-5 pb-20 pt-32 sm:px-8 md:pb-28 md:pt-40">
            <Rise>
              <p className="px-label text-muted">{t.hero.eyebrow}</p>
              <h1 className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.03] tracking-[-0.02em] sm:text-6xl md:text-7xl">
                {t.hero.titleLead} <em className="text-emerald">{t.hero.titleEm}</em>
              </h1>
            </Rise>
            <Rise delay={0.12}>
              <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
                {t.hero.body}
              </p>
            </Rise>
            <Rise delay={0.22}>
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <a
                  href={localizeHref("/waitlist", locale)}
                  className="px-label inline-flex items-center justify-center gap-2 bg-emerald px-8 py-4 text-white shadow-[6px_6px_0_0_rgba(5,150,105,0.25)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_rgba(5,150,105,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
                >
                  {t.hero.ctaPrimary}
                </a>
                <a
                  href="#table"
                  className="px-label inline-flex items-center justify-center border border-line/30 px-8 py-4 text-ink transition-all duration-200 hover:border-line hover:bg-ink/5"
                >
                  {t.hero.ctaSecondary}
                </a>
              </div>
            </Rise>
          </div>
        </section>

        {/* Comparison table */}
        <section id="table" className="bg-mist text-ink">
          <PixelEdge color="#F7F8F3" />
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
            <Rise className="max-w-3xl">
              <p className="px-label text-muted">{t.table.eyebrow}</p>
              <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                {t.table.titleLead} <em className="text-muted">{t.table.titleEm}</em>
              </h2>
            </Rise>

            <Rise delay={0.1}>
              <div className="mt-12 overflow-x-auto">
                <table className="w-full min-w-[680px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="px-label py-4 pr-6 align-bottom text-muted" />
                      <th className="px-label py-4 pr-6 align-bottom text-muted">
                        {t.table.colStack}
                      </th>
                      <th className="py-4 align-bottom">
                        <span className="px-label inline-flex items-center gap-2 text-ink">
                          <PixelIcon rows={[...PX.ghost]} className="h-4 w-4 text-ink" />
                          {t.table.colGhosty}
                        </span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.table.rows.map((row) => (
                      <tr key={row.capability} className="border-b border-line/70 align-top">
                        <th scope="row" className="py-5 pr-6 text-[15px] font-semibold">
                          {row.capability}
                        </th>
                        <td className="py-5 pr-6 text-[15px] leading-relaxed text-muted">
                          {row.stack}
                        </td>
                        <td className="py-5 text-[15px] leading-relaxed">{row.ghosty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Rise>
          </div>
        </section>

        {/* When to choose */}
        <section className="bg-paper text-ink">
          <PixelEdge color="#EBF5EF" />
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
            <Rise className="max-w-3xl">
              <p className="px-label text-muted">{t.choice.eyebrow}</p>
              <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                {t.choice.titleLead} <em className="text-emerald">{t.choice.titleEm}</em>
              </h2>
            </Rise>
            <div className="mt-16 grid gap-6 md:grid-cols-2">
              <Rise>
                <article className="h-full border border-line bg-surface p-8 sm:p-10">
                  <span className="px-label text-muted">{t.choice.stackLabel}</span>
                  <p className="mt-6 text-pretty text-lg leading-relaxed text-ink">
                    {t.choice.stackBody}
                  </p>
                </article>
              </Rise>
              <Rise delay={0.12}>
                <article className="group h-full bg-mist p-8 text-ink transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#059669] sm:p-10">
                  <span className="px-label inline-flex items-center gap-2 text-muted">
                    <PixelIcon rows={[...PX.ghost]} className="h-4 w-4 text-ink" />
                    {t.choice.ghostyLabel}
                  </span>
                  <p className="mt-6 text-pretty text-lg leading-relaxed">
                    {t.choice.ghostyBody}
                  </p>
                </article>
              </Rise>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="bg-mist text-ink">
          <PixelEdge color="#F7F8F3" />
          <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 md:py-32">
            <Rise>
              <p className="px-label text-muted">{t.faq.eyebrow}</p>
              <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                {t.faq.titleLead} <em className="text-muted">{t.faq.titleEm}</em>
              </h2>
            </Rise>
            <dl className="mt-12 flex flex-col">
              {t.faq.items.map((item, i) => (
                <Rise key={item.q} delay={i * 0.06}>
                  <div className="border-t border-line py-7">
                    <dt className="font-display text-xl font-semibold tracking-tight sm:text-2xl">
                      {item.q}
                    </dt>
                    <dd className="mt-3 text-pretty leading-relaxed text-muted">{item.a}</dd>
                  </div>
                </Rise>
              ))}
            </dl>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative flex flex-col bg-paper text-ink">
          <PixelEdge color="#EBF5EF" />
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-28 text-center sm:px-8">
            <Rise>
              <PixelIcon rows={[...PX.ghost]} className="mx-auto h-14 w-16 text-emerald" />
            </Rise>
            <Rise delay={0.1}>
              <h2 className="mt-9 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl md:text-6xl">
                {t.cta.titleLead} <em className="text-emerald">{t.cta.titleEm}</em>
              </h2>
            </Rise>
            <Rise delay={0.2}>
              <a
                href={localizeHref("/waitlist", locale)}
                className="px-label mt-10 inline-flex items-center justify-center gap-2 bg-emerald px-9 py-4 text-white shadow-[6px_6px_0_0_rgba(5,150,105,0.25)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_rgba(5,150,105,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
              >
                {t.cta.cta}
              </a>
            </Rise>
            <Rise delay={0.3}>
              <p className="px-label mt-9 text-muted">{t.cta.note}</p>
            </Rise>
          </div>
        </section>

      </main>
    </div>
  );
}
