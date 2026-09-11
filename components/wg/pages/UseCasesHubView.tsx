import { Rise } from "@/components/wg/Rise";
import { localizeHref, type Dictionary, type Locale } from '@/lib/i18n';

/** Ported verbatim from the design lab (app/[locale]/use-cases/page.tsx), bilingual via {dict, locale}. */
export function UseCasesHubView({ dict, locale }: { dict: Dictionary; locale: Locale }) {
  const t = dict.useCases;

  return (
    <div className="bg-paper text-ink">
      <main>
        <section className="mx-auto max-w-5xl px-5 pb-20 pt-32 sm:px-8 md:pb-28 md:pt-40">
          <Rise>
            <p className="px-label text-muted">{t.eyebrow}</p>
            <h1 className="mt-5 text-balance font-display text-5xl font-semibold leading-[1.03] tracking-[-0.02em] sm:text-6xl">
              {t.titleLead} <em className="text-emerald">{t.titleEm}</em>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
              {t.intro}
            </p>
          </Rise>
          <div className="mt-14 grid gap-6 md:grid-cols-3">
            {t.roles.map((role, i) => (
              <Rise key={role.slug} delay={i * 0.1}>
                <a
                  href={localizeHref(`/use-cases/${role.slug}`, locale)}
                  className="group flex h-full flex-col border border-line bg-surface p-8 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#D4DCD6]"
                >
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                    {role.label}
                  </h2>
                  <p className="mt-4 flex-1 text-pretty leading-relaxed text-muted">{role.blurb}</p>
                  <span className="px-label mt-6 inline-block text-emerald">{t.exploreLabel}</span>
                </a>
              </Rise>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
