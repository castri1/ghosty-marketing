import { PixelEdge, PixelIcon, PX } from "./PixelBits";
import { Rise } from "./Rise";
import type { Locale } from "@/lib/wg-copy";
import type { Dictionary } from "@/lib/wg-copy";
import { localizeHref } from "@/lib/wg-copy";

export function AltCTA({
  dict,
  locale,
}: {
  dict: Dictionary["home"]["cta"];
  locale: Locale;
}) {
  return (
    <section
      id="get-started"
      className="relative flex min-h-[85vh] flex-col bg-paper text-ink"
    >
      <PixelEdge color="#EBF5EF" />
      <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col items-center justify-center px-5 py-28 text-center sm:px-8">
        <Rise>
          <PixelIcon rows={[...PX.ghost]} className="mx-auto h-16 w-20 text-emerald" />
        </Rise>
        <Rise delay={0.1}>
          <h2 className="mt-10 text-balance font-display text-5xl font-semibold leading-[1.02] tracking-[-0.02em] sm:text-6xl md:text-7xl">
            {dict.titleLead} <em className="text-emerald">{dict.titleEm}</em>
          </h2>
        </Rise>
        <Rise delay={0.2}>
          <p className="mx-auto mt-7 max-w-xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
            {dict.body}
          </p>
        </Rise>
        <Rise delay={0.3}>
          <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <a
              href={localizeHref("/waitlist", locale)}
              className="px-label inline-flex items-center justify-center gap-2 bg-emerald px-9 py-4 text-white shadow-[6px_6px_0_0_rgba(5,150,105,0.25)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_rgba(5,150,105,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
            >
              {dict.ctaPrimary}
            </a>
            <a
              href="#how"
              className="px-label inline-flex items-center justify-center border border-line/30 px-9 py-4 text-ink transition-all duration-200 hover:border-line hover:bg-ink/5"
            >
              {dict.ctaSecondary}
            </a>
          </div>
        </Rise>
        <Rise delay={0.4}>
          <p className="px-label mt-9 text-muted">{dict.note}</p>
        </Rise>
      </div>
    </section>
  );
}
