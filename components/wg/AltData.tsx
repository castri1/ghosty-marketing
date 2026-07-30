import type { Dictionary } from "@/lib/wg-copy";
import { PixelEdge, PixelIcon, PX } from "./PixelBits";
import { Rise } from "./Rise";

const ICONS = [PX.lock, PX.building];

export function AltData({ dict }: { dict: Dictionary["home"]["data"] }) {
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

        <div className="mt-16 grid gap-6 md:grid-cols-2">
          {dict.options.map((opt, i) => (
            <Rise key={opt.title} delay={i * 0.12}>
              <article className="h-full border border-line p-8 transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#D4DCD6] sm:p-10">
                <div className="flex items-center justify-between">
                  <PixelIcon
                    rows={[...ICONS[i]]}
                    className="h-11 w-11 text-ink"
                  />
                  <span className="px-label text-muted">{opt.label}</span>
                </div>
                <h3 className="mt-7 text-balance font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                  {opt.title}
                </h3>
                <p className="mt-4 text-pretty leading-relaxed text-muted">
                  {opt.body}
                </p>
              </article>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
