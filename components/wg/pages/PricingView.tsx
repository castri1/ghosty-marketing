import { Rise } from '@/components/wg/Rise';
import { PixelEdge, PixelIcon, PX } from '@/components/wg/PixelBits';
import { localizeHref, type Dictionary, type Locale } from '@/lib/i18n';
import { siteUrl } from '@/lib/site';

const PLEDGE_ICONS = [PX.shield, PX.toggle, PX.plug];

/**
 * Pricing v2 (approved 2026-08-28). Five tiers on one journey, the gauge, the
 * per-unit Advanced layer, the agency model and the billing pledge. Copy lives
 * in `lib/wg-dict.ts`; the internal economics annexe never lands here.
 */
export function PricingView({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.pricing;

  // Offer JSON-LD: agents answering "what does it cost?" get the list prices
  // from structured data rather than parsing the cards.
  const offersJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: 'White Ghost',
    description: dict.meta.pricing.description,
    url: siteUrl(localizeHref('/pricing', locale)),
    brand: { '@type': 'Brand', name: 'White Ghost' },
    offers: t.tiers.map((tier) => ({
      '@type': 'Offer',
      name: tier.name,
      description: tier.who,
      url: siteUrl(localizeHref('/pricing', locale)),
      priceCurrency: 'USD',
      price: tier.price.replace(/[^0-9.]/g, '') || '0',
      ...(tier.price.startsWith('from') ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: 1500, priceCurrency: 'USD' } } : {}),
      availability: 'https://schema.org/InStock',
    })),
  };

  return (
    <div className="bg-paper text-ink">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(offersJsonLd) }}
      />

      <main>
        {/* Hero */}
        <section className="mx-auto max-w-4xl px-5 pb-16 pt-32 sm:px-8 md:pt-40">
          <Rise>
            <p className="px-label text-muted">{t.eyebrow}</p>
            <h1 className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.03] tracking-[-0.02em] sm:text-6xl md:text-7xl">
              {t.titleLead} <em className="text-emerald">{t.titleEm}</em>
            </h1>
          </Rise>
          <Rise delay={0.12}>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
              {t.intro}
            </p>
          </Rise>
          <Rise delay={0.2}>
            <p className="px-label mt-9 inline-block border border-emerald/40 bg-emerald/5 px-4 py-2 text-emerald">
              {t.foundingNote}
            </p>
          </Rise>
          <Rise delay={0.26}>
            <p className="mt-8 font-display text-lg tracking-tight text-ink">{t.journey}</p>
            <p className="mt-2 text-sm leading-relaxed text-muted">{t.journeyNote}</p>
          </Rise>
        </section>

        {/* Plans */}
        <section id="plans" className="bg-mist text-ink">
          <PixelEdge color="#F7F8F3" />
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-28">
            <Rise>
              <p className="px-label text-muted">{t.groupSolo}</p>
            </Rise>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {t.tiers.slice(0, 2).map((tier, i) => (
                <Rise key={tier.name} delay={i * 0.08}>
                  <TierCard tier={tier} locale={locale} />
                </Rise>
              ))}
            </div>

            <Rise>
              <p className="px-label mt-16 text-muted">{t.groupTeams}</p>
            </Rise>
            <div className="mt-6 grid gap-6 md:grid-cols-3">
              {t.tiers.slice(2).map((tier, i) => (
                <Rise key={tier.name} delay={i * 0.08}>
                  <TierCard tier={tier} locale={locale} popularLabel={t.popular} />
                </Rise>
              ))}
            </div>

            <Rise delay={0.1}>
              <ul className="mt-12 flex flex-col gap-2 text-sm leading-relaxed text-muted sm:flex-row sm:flex-wrap sm:gap-x-8">
                {t.footnotes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            </Rise>
          </div>
        </section>

        {/* The gauge */}
        <section className="bg-paper text-ink">
          <PixelEdge color="#EBF5EF" />
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
            <div className="grid gap-12 md:grid-cols-2 md:items-center">
              <Rise>
                <PixelIcon rows={[...PX.gauge]} className="h-9 w-11 text-ink" />
                <p className="px-label mt-6 text-muted">{t.gauge.eyebrow}</p>
                <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                  {t.gauge.title}
                </h2>
                <p className="mt-6 text-pretty leading-relaxed text-muted">{t.gauge.body}</p>
              </Rise>

              <Rise delay={0.12}>
                <figure className="border border-line bg-mist p-7">
                  <figcaption className="flex items-baseline justify-between gap-4">
                    <span className="px-label text-muted">{t.gauge.planLabel}</span>
                    <span className="px-label text-emerald">{t.gauge.reading}</span>
                  </figcaption>

                  <div className="mt-5 h-3 w-full bg-line/40">
                    <div className="h-full bg-emerald" style={{ width: `${t.gauge.value}%` }} />
                  </div>
                  <p className="px-label mt-2 text-right text-muted">{t.gauge.alert}</p>

                  <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-ink">
                    {t.gauge.driver}
                  </p>

                  <dl className="mt-6 flex flex-col gap-3">
                    {t.gauge.bars.map((bar) => (
                      <div key={bar.label} className="flex items-center gap-4">
                        <dt className="px-label w-28 shrink-0 text-muted">{bar.label}</dt>
                        <dd className="h-1.5 w-full bg-line/40">
                          <div className="h-full bg-ink/50" style={{ width: `${bar.value}%` }} />
                        </dd>
                      </div>
                    ))}
                  </dl>
                </figure>
              </Rise>
            </div>
          </div>
        </section>

        {/* Advanced pricing */}
        <section id="advanced" className="bg-mist text-ink">
          <PixelEdge color="#F7F8F3" />
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 md:py-32">
            <Rise className="max-w-3xl">
              <p className="px-label text-muted">{t.advanced.eyebrow}</p>
              <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                {t.advanced.title}
              </h2>
              <p className="mt-6 text-pretty leading-relaxed text-muted">{t.advanced.body}</p>
            </Rise>

            <Rise delay={0.1}>
              <div className="mt-12 overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left">
                  <thead>
                    <tr className="border-b border-line">
                      <th className="px-label py-4 pr-6 align-bottom text-muted">
                        {t.advanced.colUnit}
                      </th>
                      <th className="px-label py-4 pr-6 align-bottom text-muted">
                        {t.advanced.colPrice}
                      </th>
                      <th className="px-label py-4 align-bottom text-muted">
                        {t.advanced.colWhat}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {t.advanced.rows.map((row) => (
                      <tr key={row.unit} className="border-b border-line/60">
                        <td className="py-5 pr-6 align-top font-display font-medium tracking-tight">
                          {row.unit}
                        </td>
                        <td className="py-5 pr-6 align-top font-display text-emerald">
                          {row.price}
                        </td>
                        <td className="py-5 align-top leading-relaxed text-muted">{row.what}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Rise>
          </div>
        </section>

        {/* Agencies */}
        <section className="bg-paper text-ink">
          <PixelEdge color="#EBF5EF" />
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 md:py-32">
            <Rise>
              <p className="px-label text-muted">{t.agencies.eyebrow}</p>
              <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                {t.agencies.title}
              </h2>
              <p className="mt-6 max-w-2xl text-pretty leading-relaxed text-muted">
                {t.agencies.body}
              </p>
            </Rise>
            <Rise delay={0.1}>
              <div className="mt-10 border border-line p-8">
                <p className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {t.agencies.price}
                </p>
                <ul className="mt-7 flex flex-col gap-3">
                  {t.agencies.points.map((point) => (
                    <li key={point} className="flex gap-3 leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-2 h-1.5 w-1.5 shrink-0 bg-emerald" />
                      {point}
                    </li>
                  ))}
                </ul>
                <p className="mt-7 border-t border-line pt-6 text-pretty leading-relaxed text-ink">
                  {t.agencies.example}
                </p>
              </div>
            </Rise>
          </div>
        </section>

        {/* The pledge */}
        <section className="bg-mist text-ink">
          <PixelEdge color="#F7F8F3" />
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
            <Rise className="max-w-3xl">
              <p className="px-label text-muted">{t.pledge.eyebrow}</p>
              <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                {t.pledge.title}
              </h2>
            </Rise>
            <div className="mt-12 grid gap-6 md:grid-cols-3">
              {t.pledge.items.map((item, i) => (
                <Rise key={item.title} delay={i * 0.1}>
                  <article className="h-full border border-line bg-paper p-8">
                    <PixelIcon
                      rows={[...PLEDGE_ICONS[i % PLEDGE_ICONS.length]]}
                      className="h-9 w-11 text-ink"
                    />
                    <h3 className="mt-6 font-display text-xl font-semibold tracking-tight">
                      {item.title}
                    </h3>
                    <p className="mt-3 text-pretty leading-relaxed text-muted">{item.body}</p>
                  </article>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        {/* Closing CTA */}
        <section className="relative flex flex-col bg-paper text-ink">
          <PixelEdge color="#EBF5EF" />
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 py-24 text-center sm:px-8">
            <Rise>
              <h2 className="text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl">
                {t.ctaTitle}
              </h2>
            </Rise>
            <Rise delay={0.1}>
              <a
                href={localizeHref('/waitlist', locale)}
                className="px-label mt-9 inline-flex items-center justify-center gap-2 bg-emerald px-9 py-4 text-white shadow-[6px_6px_0_0_rgba(5,150,105,0.25)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_rgba(5,150,105,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
              >
                {t.cta}
              </a>
            </Rise>
            <Rise delay={0.16}>
              <p className="px-label mt-7 text-muted">{t.note}</p>
            </Rise>
          </div>
        </section>
      </main>
    </div>
  );
}

function TierCard({
  tier,
  locale,
  popularLabel,
}: {
  tier: Dictionary['pricing']['tiers'][number];
  locale: Locale;
  popularLabel?: string;
}) {
  const highlight = tier.popular;
  return (
    <article
      className={`relative flex h-full flex-col border bg-paper p-8 ${
        highlight ? 'border-emerald shadow-[8px_8px_0_0_rgba(5,150,105,0.18)]' : 'border-line'
      }`}
    >
      {highlight && popularLabel && (
        <span className="px-label absolute -top-3 left-8 bg-emerald px-3 py-1 text-white">
          {popularLabel}
        </span>
      )}

      <h2 className="font-display text-2xl font-semibold tracking-tight">{tier.name}</h2>
      <p className="mt-2 text-sm leading-relaxed text-muted">{tier.who}</p>

      <p className="mt-7 font-display text-4xl font-semibold tracking-[-0.02em]">
        {tier.price}
        {tier.period && (
          <span className="ml-1 font-sans text-base font-normal text-muted">{tier.period}</span>
        )}
      </p>

      <ul className="mt-7 flex flex-1 flex-col gap-3">
        {tier.features.map((feature) => (
          <li key={feature} className="flex gap-3 text-sm leading-relaxed text-muted">
            <span aria-hidden="true" className="mt-1.5 h-1.5 w-1.5 shrink-0 bg-emerald" />
            {feature}
          </li>
        ))}
      </ul>

      <a
        href={localizeHref('/waitlist', locale)}
        className={`px-label mt-9 inline-flex items-center justify-center px-6 py-3.5 transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald ${
          highlight
            ? 'bg-emerald text-white shadow-[4px_4px_0_0_rgba(5,150,105,0.25)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0_0_rgba(5,150,105,0.3)]'
            : 'border border-line text-ink hover:bg-ink/5'
        }`}
      >
        {tier.cta}
      </a>
    </article>
  );
}
