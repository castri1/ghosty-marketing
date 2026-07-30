import { PixelEdge, PixelIcon, PX } from "./PixelBits";
import { Rise } from "./Rise";
import type { Dictionary } from "@/lib/wg-copy";

const ICONS = [PX.grid, PX.ghost];

export function AltAppsAgents({ dict }: { dict: Dictionary["home"]["apps"] }) {
  return (
    <section id="product" className="bg-mist text-ink">
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

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {dict.powers.map((power, i) => (
            <Rise key={power.label} delay={i * 0.12}>
              <article className="group h-full bg-paper p-8 text-ink transition-all duration-200 hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[10px_10px_0_0_#D4DCD6] sm:p-10">
                <div className="flex items-center justify-between">
                  <PixelIcon
                    rows={[...ICONS[i]]}
                    className="h-12 w-13 text-emerald"
                  />
                  <span className="px-label text-muted">{power.label}</span>
                </div>
                <h3 className="mt-8 text-balance font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {power.title}
                </h3>
                <p className="mt-4 text-pretty leading-relaxed text-muted">
                  {power.body}
                </p>
                <ul className="mt-7 flex flex-col gap-3 border-t border-line pt-6">
                  {power.points.map((point) => (
                    <li key={point} className="flex items-start gap-3 text-[15px]">
                      <span
                        className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-emerald"
                        aria-hidden="true"
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
