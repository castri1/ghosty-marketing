import type { Dictionary } from "@/lib/wg-copy";
import { PixelEdge, PixelIcon, PX } from "./PixelBits";
import { Rise } from "./Rise";

const ICONS = [PX.gauge, PX.toggle, PX.sparkle];

export function AltCosts({ dict }: { dict: Dictionary["home"]["costs"] }) {
  return (
    <section className="bg-mist text-ink">
      <PixelEdge color="#F7F8F3" />
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Rise className="max-w-3xl">
          <p className="px-label text-muted">{dict.eyebrow}</p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl">
            {dict.titleLead}{" "}<em className="text-muted">{dict.titleEm}</em>
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
            {dict.intro}
          </p>
        </Rise>

        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {dict.cards.map((card, i) => (
            <Rise key={card.title} delay={i * 0.1}>
              <article className="h-full border border-line p-8 transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#D4DCD6] sm:p-9">
                <PixelIcon rows={[...ICONS[i]]} className="h-10 w-11 text-ink" />
                <h3 className="mt-6 text-balance font-display text-xl font-semibold tracking-tight sm:text-2xl">
                  {card.title}
                </h3>
                <p className="mt-3 text-pretty leading-relaxed text-muted">
                  {card.body}
                </p>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
