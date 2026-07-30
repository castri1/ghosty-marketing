import type { Metadata } from 'next';
import { Rise } from "@/components/wg/Rise";
import { copy, localizeHref } from '@/lib/wg-copy';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: copy.meta.compareHub.title,
  description: copy.meta.compareHub.description,
  path: '/compare',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

/** Ported verbatim from the design lab (app/[locale]/compare/page.tsx), English-only. */
export default function CompareHubPage() {
  const locale = 'en' as const;
  const t = copy.compareHub;

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
          <div className="mt-14 grid gap-6 md:grid-cols-2">
            {t.items.map((item, i) => (
              <Rise key={item.href} delay={i * 0.1}>
                <a
                  href={localizeHref(item.href, locale)}
                  className="group block h-full border border-line bg-surface p-8 transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#D4DCD6] sm:p-10"
                >
                  <h2 className="font-display text-2xl font-semibold tracking-tight text-ink">
                    {item.title}
                  </h2>
                  <p className="mt-4 text-pretty leading-relaxed text-muted">{item.body}</p>
                  <span className="px-label mt-6 inline-block text-emerald">{item.cta}</span>
                </a>
              </Rise>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
