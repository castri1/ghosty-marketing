import type { Dictionary } from "@/lib/wg-copy";
import { PixelEdge, PixelIcon, PX } from "./PixelBits";
import { Rise } from "./Rise";

export function AltConnect({ dict }: { dict: Dictionary["home"]["connect"] }) {
  return (
    <section className="bg-paper text-ink">
      <PixelEdge color="#EBF5EF" />
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Rise className="max-w-3xl">
          <p className="px-label text-muted">{dict.eyebrow}</p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl">
            {dict.titleLead}{" "}<em className="text-emerald">{dict.titleEm}</em>
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
            {dict.intro}
          </p>
        </Rise>

        <Rise delay={0.12}>
          <p className="px-label mt-14 text-muted">{dict.tilesLabel}</p>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {dict.tiles.map((tile) => (
              <div
                key={tile}
                className="flex items-center gap-3 border border-line px-5 py-4 transition-colors duration-300 hover:border-emerald/40"
              >
                <span
                  className="h-1.5 w-1.5 shrink-0 bg-emerald animate-blink"
                  aria-hidden="true"
                />
                <span className="text-[15px] font-medium text-ink">{tile}</span>
              </div>
            ))}
          </div>
        </Rise>

        <Rise delay={0.2}>
          <div className="mt-10 flex items-start gap-4 border-l-2 border-emerald/50 pl-5">
            <PixelIcon
              rows={[...PX.plug]}
              className="mt-0.5 h-8 w-8 shrink-0 text-emerald"
            />
            <p className="max-w-2xl text-pretty leading-relaxed text-muted">
              {dict.note}
            </p>
          </div>
        </Rise>
      </div>
    </section>
  );
}
