import Link from "next/link";
import { PixelEdge } from "./PixelBits";
import { Rise } from "./Rise";
import { localizeHref, type Dictionary, type Locale } from "@/lib/i18n";

/** The About chapter that carries the proof ("Today 99 applications run
 * there … A lawyer built it."). Same index in en.ts and es.ts. */
const PROOF_CHAPTER = 3;

/**
 * Customer proof, right after the home hero. It has no copy of its own: every
 * string is the About page's approved text, read from the same `about` keys
 * (story label, title, intro, the "in numbers" figures, the chapter above, and
 * the eyebrow as the link label), so the two pages cannot drift apart. Server
 * component; the only client code is the `Rise` reveal the other home sections
 * already load.
 */
export function AltProof({ dict, locale }: { dict: Dictionary["about"]; locale: Locale }) {
  const chapter = dict.chapters[PROOF_CHAPTER];

  return (
    <section id="proof" className="bg-mist text-ink">
      <PixelEdge color="#F7F8F3" />
      <div className="mx-auto max-w-6xl px-5 py-24 sm:px-8 md:py-32">
        <Rise className="max-w-3xl">
          <p className="px-label text-muted">{dict.storyLabel}</p>
          <h2 className="mt-5 text-balance font-display text-4xl font-semibold tracking-[-0.02em] sm:text-5xl md:text-6xl">
            {dict.titleLead} <em className="text-emerald">{dict.titleEm}</em>
          </h2>
          <p className="mt-6 max-w-2xl text-pretty text-lg leading-relaxed text-muted md:text-xl">
            {dict.intro}
          </p>
        </Rise>

        <Rise delay={0.1}>
          <p className="px-label mt-16 text-muted">{dict.proofLabel}</p>
        </Rise>
        <div className="mt-8 grid grid-cols-2 gap-5 md:grid-cols-4">
          {dict.proof.map((item, i) => (
            <Rise key={item.label} delay={i * 0.08}>
              <article className="h-full border border-line bg-surface p-6 sm:p-8">
                <p className="font-display text-4xl font-semibold tracking-tight">{item.figure}</p>
                <p className="mt-1 text-sm text-muted">{item.label}</p>
              </article>
            </Rise>
          ))}
        </div>

        <Rise delay={0.2}>
          <div className="mt-12 max-w-3xl border-l-2 border-emerald pl-6 sm:pl-8">
            <h3 className="text-balance font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {chapter.title}
            </h3>
            <p className="mt-3 text-pretty leading-relaxed text-muted">{chapter.body}</p>
            <Link
              href={localizeHref("/about", locale)}
              className="px-label mt-6 inline-flex items-center gap-2 text-emerald underline underline-offset-4"
            >
              {dict.eyebrow}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
        </Rise>
      </div>
    </section>
  );
}
