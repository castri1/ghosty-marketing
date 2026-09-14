import Link from "next/link";
import { PixelEdge, PixelIcon, PX } from "./PixelBits";
import { Rise } from "./Rise";
import { signupUrl } from "@/lib/console-url";
import type { Dictionary, Locale } from "@/lib/i18n";

const ICONS = [PX.sparkle, PX.laptop, PX.people];

/**
 * The individual creator's entry, right under the hero: someone already built
 * an app with Claude Code or Codex and needs to publish and share it. Plain
 * text on purpose (what it does, what you need, what you get), so a search
 * engine or an LLM can read it without JSON-LD. The company story continues
 * below it.
 */
export function AltCreator({ dict, locale }: { dict: Dictionary["home"]["creator"]; locale: Locale }) {
  const localhost = locale === "es" ? "/es/localhost" : "/localhost";
  return (
    <section id="creator" className="bg-paper text-ink">
      <PixelEdge color="#EBF5EF" />
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Rise className="max-w-3xl">
          <p className="px-label text-muted">{dict.eyebrow}</p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl">
            {dict.titleLead} <em className="text-emerald">{dict.titleEm}</em>
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
            {dict.intro}
          </p>
        </Rise>

        <div className="mt-16 grid gap-5 md:grid-cols-3">
          {dict.columns.map((col, i) => (
            <Rise key={col.title} delay={i * 0.1}>
              <article className="group h-full border border-line bg-surface p-8 transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0_0_#D4DCD6]">
                <PixelIcon
                  rows={[...ICONS[i]]}
                  className="h-10 w-11 text-ink transition-colors duration-200 group-hover:text-[#047857]"
                />
                <h3 className="mt-6 font-display text-2xl font-semibold tracking-tight">{col.title}</h3>
                <ul className="mt-4 space-y-2.5 text-[15px] leading-relaxed text-muted">
                  {col.items.map((item) => (
                    <li key={item} className="flex gap-2.5">
                      <span aria-hidden="true" className="select-none text-emerald">▸</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </article>
            </Rise>
          ))}
        </div>

        <Rise delay={0.2}>
          <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center">
            <a
              href={signupUrl("home-creator")}
              className="px-label inline-flex items-center justify-center gap-2 bg-emerald px-8 py-4 text-white shadow-[6px_6px_0_0_rgba(5,150,105,0.25)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_rgba(5,150,105,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
            >
              {dict.ctaPrimary}
            </a>
            <Link href={localhost} className="px-label text-emerald underline underline-offset-4">
              {dict.ctaSecondary}
            </Link>
          </div>
          <p className="mt-10 max-w-2xl text-pretty leading-relaxed text-muted">
            {dict.bridge}{" "}
            <a href="#how" className="text-emerald underline underline-offset-4">
              {dict.bridgeLink}
            </a>
          </p>
        </Rise>
      </div>
    </section>
  );
}
