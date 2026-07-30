import type { Metadata } from 'next';
import { Rise } from "@/components/wg/Rise";
import { PixelEdge, PixelIcon, PX } from "@/components/wg/PixelBits";
import { copy, localizeHref } from '@/lib/wg-copy';
import { pageMeta } from '@/lib/site';

const ICONS = [PX.building, PX.shield, PX.grid, PX.lock, PX.building, PX.eye];

export const metadata: Metadata = pageMeta({
  title: copy.meta.security.title,
  description: copy.meta.security.description,
  path: '/security',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Ported verbatim from the design lab (app/[locale]/security/page.tsx), English-only. */
export default function SecurityPage() {
  const locale = 'en' as const;
  const t = copy.security;

  return (
    <div className="bg-paper text-ink">
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
