import { PixelField } from "./PixelField";
import { Rise } from "./Rise";
import type { Locale } from "@/lib/wg-copy";
import type { Dictionary } from "@/lib/wg-copy";
import { localizeHref } from "@/lib/wg-copy";

export function AltHero({
  dict,
  locale,
}: {
  dict: Dictionary["home"]["hero"];
  locale: Locale;
}) {
  return (
    <section
      id="top"
      className="relative flex min-h-screen items-center overflow-hidden bg-paper"
    >
      <PixelField className="absolute inset-0 z-0 h-full w-full" />

      {/* Soft vignette so copy stays readable over the texture */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-[1] bg-[radial-gradient(ellipse_70%_70%_at_30%_50%,rgba(247,248,243,0.88)_0%,rgba(247,248,243,0.45)_55%,transparent_100%)]"
      />

      <div className="pointer-events-none relative z-10 mx-auto w-full max-w-6xl px-5 pb-32 pt-40 sm:px-8">
        <div className="max-w-3xl">
          <Rise>
            <a
              href="#product"
              className="px-label pointer-events-auto inline-flex items-center gap-2.5 border border-line bg-paper/70 px-4 py-2.5 text-emerald backdrop-blur-sm transition-colors duration-200 hover:border-emerald/50"
            >
              <span className="h-2 w-2 bg-emerald" aria-hidden="true" />
              {dict.badge}
            </a>
          </Rise>

          <Rise delay={0.1}>
            <h1 className="mt-8 font-display text-[44px] font-semibold leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              {dict.titleLead} <em className="text-emerald">{dict.titleEm}</em>
            </h1>
          </Rise>

          <Rise delay={0.2}>
            <p className="mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
              {dict.body}
            </p>
          </Rise>

          <Rise delay={0.3}>
            <div className="pointer-events-auto mt-10 flex flex-col gap-3 sm:flex-row">
              <a
                href={localizeHref("/waitlist", locale)}
                className="px-label inline-flex items-center justify-center gap-2 bg-emerald px-8 py-4 text-white shadow-[6px_6px_0_0_rgba(5,150,105,0.25)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_rgba(5,150,105,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
              >
                {dict.ctaPrimary}
              </a>
              <a
                href="#how"
                className="px-label inline-flex items-center justify-center border border-line/30 px-8 py-4 text-ink transition-all duration-200 hover:border-line hover:bg-ink/5"
              >
                {dict.ctaSecondary}
              </a>
            </div>
          </Rise>
        </div>
      </div>

      {/* Bottom mono ticker line */}
      <div className="absolute inset-x-0 bottom-0 z-10 border-t border-line/70">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4 sm:px-8">
          <p className="px-label flex items-center gap-2 text-muted">
            {dict.scroll}
            <span className="inline-block h-3 w-2 bg-emerald animate-blink" aria-hidden="true" />
          </p>
          <p className="px-label hidden text-muted sm:block">{dict.ticker}</p>
        </div>
      </div>
    </section>
  );
}
