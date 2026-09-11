import { Rise } from "@/components/wg/Rise";
import { PixelEdge, PixelIcon, PX } from "@/components/wg/PixelBits";
import { localizeHref, type Dictionary, type Locale } from '@/lib/i18n';

/** Ported verbatim from the design lab (app/[locale]/about/page.tsx), bilingual via {dict, locale}. */
export function AboutView({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.about;

  return (
    <div className="bg-paper text-ink">

      <main>
        {/* Hero */}
        <section className="relative overflow-hidden">
          <div className="mx-auto max-w-4xl px-5 pb-20 pt-32 sm:px-8 md:pb-28 md:pt-40">
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
          </div>
        </section>

        {/* Mission */}
        <section className="bg-mist text-ink">
          <PixelEdge color="#F7F8F3" />
          <div className="mx-auto max-w-3xl px-5 py-24 sm:px-8 md:py-32">
            <Rise>
              <p className="px-label text-muted">{t.missionTitle}</p>
              <p className="mt-6 text-pretty font-display text-2xl leading-snug tracking-tight sm:text-3xl md:text-4xl">
                {t.mission}
              </p>
            </Rise>
          </div>
        </section>

        {/* Team */}
        <section className="bg-paper text-ink">
          <PixelEdge color="#EBF5EF" />
          <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
            <Rise>
              <p className="px-label text-muted">{t.teamTitle}</p>
            </Rise>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {t.team.map((member, i) => (
                <Rise key={member.name} delay={i * 0.1}>
                  <article className="h-full border border-line bg-surface p-8">
                    <PixelIcon rows={[...PX.ghost]} className="h-10 w-12 text-emerald" />
                    <h2 className="mt-6 font-display text-xl font-semibold tracking-tight">
                      {member.name}
                    </h2>
                    <p className="mt-1 text-sm text-muted">{member.role}</p>
                  </article>
                </Rise>
              ))}
            </div>
            <Rise delay={0.1}>
              <p className="px-label mt-6 text-muted">{t.teamNote}</p>
            </Rise>
          </div>
        </section>

        {/* CTA */}
        <section className="relative flex flex-col bg-paper text-ink">
          <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-5 pb-28 text-center sm:px-8">
            <Rise>
              <h2 className="text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] sm:text-5xl">
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
