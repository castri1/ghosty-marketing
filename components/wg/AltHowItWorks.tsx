import type { Dictionary } from "@/lib/wg-copy";
import { PixelEdge, PixelIcon, PX } from "./PixelBits";
import { Rise } from "./Rise";

const ICONS = [PX.chat, PX.sparkle, PX.people, PX.shield, PX.grid];

export function AltHowItWorks({ dict }: { dict: Dictionary["home"]["how"] }) {
  return (
    <section id="how" className="bg-paper text-ink">
      <PixelEdge color="#EBF5EF" />
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Rise className="max-w-3xl">
          <p className="px-label text-muted">{dict.eyebrow}</p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl">
            {dict.titleLead}{" "}
            <em className="text-emerald">{dict.titleEm}</em>
          </h2>
        </Rise>

        <ol className="mt-16 border-t border-line">
          {dict.steps.map((step, i) => (
            <li key={step.title} className="border-b border-line">
              <Rise>
                <div className="group grid gap-6 py-10 transition-colors duration-300 md:grid-cols-[90px_56px_1fr_minmax(0,340px)] md:items-start md:gap-10 md:py-12">
                  <span className="px-label text-2xl text-emerald md:pt-1">
                    0{i + 1}
                  </span>
                  <PixelIcon
                    rows={[...ICONS[i]]}
                    className="hidden h-12 w-12 text-ink/80 transition-colors duration-300 group-hover:text-emerald md:block"
                  />
                  <div>
                    <h3 className="text-balance font-display text-2xl font-semibold tracking-tight sm:text-3xl">
                      {step.title}
                    </h3>
                    <p className="mt-3 max-w-xl text-pretty leading-relaxed text-muted">
                      {step.body}
                    </p>
                  </div>
                  <p className="px-label flex items-start gap-2 border border-line bg-surface px-4 py-3.5 normal-case tracking-[0.04em] text-emerald/90 md:mt-1">
                    <span aria-hidden="true" className="select-none text-muted">
                      ▸
                    </span>
                    {step.line}
                  </p>
                </div>
              </Rise>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
