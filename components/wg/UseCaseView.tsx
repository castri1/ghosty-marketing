import { Rise } from "@/components/wg/Rise";
import { PixelEdge } from "@/components/wg/PixelBits";
import type { Locale } from "@/lib/wg-copy";
import type { Dictionary } from "@/lib/wg-copy";
import { localizeHref } from "@/lib/wg-copy";

type Role = Dictionary["useCases"]["roles"][number];

/** Shared layout for a single use-case (role) detail page. Nav and footer come from the root layout. */
export function UseCaseView({
  locale,
  dict,
  role,
}: {
  locale: Locale;
  dict: Dictionary;
  role: Role;
}) {
  const t = dict.useCases;

  return (
    <div className="bg-paper text-ink">
      <main>
        {/* Hero + problem */}
        <section className="mx-auto max-w-4xl px-5 pb-16 pt-32 sm:px-8 md:pt-40">
          <Rise>
            <a
              href={localizeHref("/use-cases", locale)}
              className="px-label text-muted transition-colors duration-200 hover:text-ink"
            >
              {t.backLabel}
            </a>
            <p className="px-label mt-8 text-emerald">{role.label}</p>
            <h1 className="mt-4 text-balance font-display text-5xl font-semibold leading-[1.03] tracking-[-0.02em] sm:text-6xl">
              {role.title} <em className="text-emerald">{role.titleEm}</em>
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
              {role.problem}
            </p>
          </Rise>
        </section>

        {/* Flow */}
        <section className="bg-mist text-ink">
          <PixelEdge color="#F7F8F3" />
          <div className="mx-auto max-w-5xl px-5 py-24 sm:px-8 md:py-32">
            <Rise>
              <p className="px-label text-muted">{t.flowTitle}</p>
            </Rise>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {role.steps.map((step, i) => (
                <Rise key={step.title} delay={i * 0.1}>
                  <article className="h-full border border-line p-8">
                    <span className="px-label text-muted">0{i + 1}</span>
                    <h2 className="mt-4 font-display text-xl font-semibold tracking-tight">
                      {step.title}
                    </h2>
                    <p className="mt-3 text-pretty leading-relaxed text-muted">{step.body}</p>
                  </article>
                </Rise>
              ))}
            </div>
            <Rise delay={0.1}>
              <div className="mt-10 border-t border-line pt-8">
                <p className="px-label text-muted">{t.resultLabel}</p>
                <p className="mt-4 text-pretty font-display text-2xl leading-snug tracking-tight sm:text-3xl">
                  {role.result}
                </p>
              </div>
            </Rise>
          </div>
        </section>

        {/* CTA */}
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
            <Rise delay={0.2}>
              <p className="px-label mt-9 text-muted">{t.note}</p>
            </Rise>
          </div>
        </section>

      </main>
    </div>
  );
}
