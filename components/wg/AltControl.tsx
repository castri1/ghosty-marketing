import type { Dictionary } from "@/lib/wg-copy";
import { PixelEdge, PixelIcon, PX } from "./PixelBits";
import { Rise } from "./Rise";

const FEATURE_ICONS = [PX.eye, PX.shield, PX.toggle];

export function AltControl({ dict }: { dict: Dictionary["home"]["control"] }) {
  return (
    <section className="bg-paper text-ink">
      <PixelEdge color="#EBF5EF" />
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Rise className="max-w-3xl">
          <p className="px-label text-muted">{dict.eyebrow}</p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl">
            {dict.titleLead}{" "}
            <em className="text-emerald">{dict.titleEm}</em>
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
            {dict.intro}
          </p>
        </Rise>

        {/* Terminal-style dashboard mockup */}
        <Rise delay={0.15}>
          <div
            aria-hidden="true"
            className="mt-16 select-none border border-line bg-surface shadow-[12px_12px_0_0_rgba(5,150,105,0.07)]"
          >
            <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
              <p className="px-label flex items-center gap-3 text-muted">
                <span className="flex gap-1.5" aria-hidden="true">
                  <span className="h-2 w-2 bg-line" />
                  <span className="h-2 w-2 bg-line" />
                  <span className="h-2 w-2 bg-emerald/60" />
                </span>
                {dict.dashboard.title}
              </p>
              <p className="px-label hidden text-emerald sm:block">
                {dict.dashboard.status}
              </p>
            </div>

            <div className="grid grid-cols-3 border-b border-line">
              {dict.dashboard.stats.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-5 py-5 ${i > 0 ? "border-l border-line" : ""}`}
                >
                  <p className="font-display text-2xl font-semibold text-ink sm:text-3xl">
                    {stat.value}
                  </p>
                  <p className="px-label mt-1.5 text-muted">{stat.label}</p>
                </div>
              ))}
            </div>

            {dict.dashboard.rows.map((row) => (
              <div
                key={row.name}
                className="flex flex-col gap-2.5 border-b border-line px-5 py-4 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-[15px] font-medium text-ink">
                    {row.name}
                  </p>
                  <p className="px-label mt-1 text-muted">{row.by}</p>
                </div>
                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="px-label border border-line px-2.5 py-1.5 text-muted">
                    {dict.dashboard.canSee} {row.sees}
                  </span>
                  <span className="px-label hidden text-muted lg:inline">
                    {row.uses}
                  </span>
                  <span className="px-label flex items-center gap-1.5 bg-emerald/15 px-2.5 py-1.5 text-emerald">
                    <span className="h-1.5 w-1.5 bg-emerald animate-blink" />
                    {dict.dashboard.live}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Rise>

        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {dict.features.map((f, i) => (
            <Rise key={f.title} delay={i * 0.1}>
              <div className="h-full border border-line p-7 transition-colors duration-300 hover:border-emerald/40">
                <PixelIcon
                  rows={[...FEATURE_ICONS[i]]}
                  className="h-9 w-10 text-emerald"
                />
                <h3 className="mt-5 font-display text-xl font-semibold tracking-tight">
                  {f.title}
                </h3>
                <p className="mt-2.5 text-[15px] leading-relaxed text-muted">
                  {f.body}
                </p>
              </div>
            </Rise>
          ))}
        </div>
      </div>
    </section>
  );
}
