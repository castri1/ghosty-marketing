import { Rise } from "@/components/wg/Rise";
import { PixelEdge, PixelIcon, PX } from "@/components/wg/PixelBits";
import { localizeHref, type Dictionary, type Locale } from '@/lib/i18n';
import { SITE_URL, siteUrl } from '@/lib/site';

const ICONS = [PX.building, PX.shield, PX.grid, PX.lock, PX.building, PX.eye];

/** Where security reports go; public/.well-known/security.txt names the same address. */
const SECURITY_EMAIL = 'hello@whiteghost.ai';

/** Ported verbatim from the design lab (app/[locale]/security/page.tsx), bilingual via {dict, locale}. */
export function SecurityView({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.security;
  const home = locale === 'es' ? '/es' : '/';
  const path = localizeHref('/security', locale);

  const jsonLd = [
    {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: dict.meta.security.title,
      description: dict.meta.security.description,
      url: siteUrl(path),
      inLanguage: locale,
      publisher: { '@type': 'Organization', name: 'White Ghost', url: SITE_URL, email: SECURITY_EMAIL },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'White Ghost', item: siteUrl(home) },
        { '@type': 'ListItem', position: 2, name: t.eyebrow, item: siteUrl(path) },
      ],
    },
  ];

  return (
    <div className="bg-paper text-ink">
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}
      <main>
        <section className="mx-auto max-w-4xl px-5 pb-16 pt-32 sm:px-8 md:pt-40">
          <Rise>
            <p className="px-label text-muted">{t.eyebrow}</p>
            <h1 className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.03] tracking-[-0.02em] sm:text-6xl md:text-7xl">
              {t.titleLead} <em className="text-emerald">{t.titleEm}</em>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
              {t.intro}
            </p>
          </Rise>
        </section>

        <section className="bg-mist text-ink">
          <PixelEdge color="#F7F8F3" />
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {t.points.map((point, i) => (
                <Rise key={point.title} delay={(i % 3) * 0.1}>
                  <article className="h-full border border-line p-8">
                    <PixelIcon rows={[...ICONS[i % ICONS.length]]} className="h-9 w-11 text-ink" />
                    <h2 className="mt-6 font-display text-xl font-semibold tracking-tight">
                      {point.title}
                    </h2>
                    <p className="mt-3 text-pretty leading-relaxed text-muted">{point.body}</p>
                  </article>
                </Rise>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-paper text-ink">
          <PixelEdge color="#EBF5EF" />
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-24 sm:px-8 md:py-32 lg:grid-cols-3">
            <Rise className="lg:col-span-2">
              <p className="px-label text-muted">{t.providers.eyebrow}</p>
              <h2 className="mt-5 text-balance font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                {t.providers.title}
              </h2>
              <p className="mt-5 max-w-2xl text-pretty leading-relaxed text-muted">{t.providers.intro}</p>
              <dl className="mt-10 border-t border-line">
                {t.providers.items.map((item) => (
                  <div
                    key={item.name}
                    className="grid gap-2 border-b border-line py-5 sm:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] sm:gap-8"
                  >
                    <dt className="font-display font-semibold tracking-tight">{item.name}</dt>
                    <dd className="text-pretty leading-relaxed text-muted">{item.purpose}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                {t.providers.policyLead}{' '}
                <a
                  href={localizeHref('/privacy', locale)}
                  className="text-ink underline underline-offset-4 hover:text-emerald"
                >
                  {t.providers.policyLabel}
                </a>
                .
              </p>
            </Rise>
            <Rise delay={0.1}>
              <article className="h-full border border-line p-8">
                <p className="px-label text-muted">{t.enterprise.eyebrow}</p>
                <h2 className="mt-5 font-display text-xl font-semibold tracking-tight">{t.enterprise.title}</h2>
                <ul className="mt-5 space-y-3">
                  {t.enterprise.items.map((item) => (
                    <li key={item} className="flex gap-3 leading-relaxed text-muted">
                      <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 bg-emerald" />
                      {item}
                    </li>
                  ))}
                </ul>
                <a
                  href={localizeHref('/pricing', locale)}
                  className="px-label mt-8 inline-block text-emerald underline-offset-4 hover:underline"
                >
                  {t.enterprise.pricingLabel}
                </a>
              </article>
            </Rise>
          </div>
        </section>

        <section id="disclosure" className="bg-mist text-ink">
          <PixelEdge color="#F7F8F3" />
          <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8">
            <Rise>
              <p className="px-label text-muted">{t.disclosure.eyebrow}</p>
              <h2 className="mt-5 text-balance font-display text-3xl font-semibold tracking-[-0.02em] sm:text-4xl">
                {t.disclosure.title}
              </h2>
              <p className="mt-5 text-pretty text-lg leading-relaxed text-muted">
                {t.disclosure.body}{' '}
                <a
                  href={`mailto:${SECURITY_EMAIL}`}
                  className="text-ink underline underline-offset-4 hover:text-emerald"
                >
                  {SECURITY_EMAIL}
                </a>
                . {t.disclosure.note}
              </p>
            </Rise>
          </div>
        </section>

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
                href={localizeHref("/waitlist", locale)}
                className="px-label mt-9 inline-flex items-center justify-center gap-2 bg-emerald px-9 py-4 text-white shadow-[6px_6px_0_0_rgba(5,150,105,0.25)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_rgba(5,150,105,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
              >
                {t.cta}
              </a>
            </Rise>
          </div>
        </section>

      </main>
    </div>
  );
}
