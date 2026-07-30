"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { PixelIcon, PX } from "@/components/wg/PixelBits";
import { Rise } from "@/components/wg/Rise";
import { StoryCanvas } from "./StoryCanvas";
import type { Locale } from "@/lib/wg-copy";
import type { Dictionary } from "@/lib/wg-copy";
import { localizeHref } from "@/lib/wg-copy";

gsap.registerPlugin(ScrollTrigger);

/**
 * Scroll-activated story: a glowing path snakes down the page, drawn as you
 * scroll. Its tip travels the route, lighting a node at each chapter, while the
 * Three.js particle field behind reacts to the same progress value. Copy is
 * bilingual (from the dictionary); the animation/geometry is unchanged.
 */
const VB_W = 1000;
const VB_H = 6000;
const N = 6;
const NODE_X = [260, 740, 500, 260, 740, 500];
const PATH_D = [
  "M 500 0",
  "C 500 220, 260 260, 260 500",
  "C 260 840, 740 1140, 740 1500",
  "C 740 1880, 500 2120, 500 2500",
  "C 500 2880, 260 3120, 260 3500",
  "C 260 3880, 740 4120, 740 4500",
  "C 740 4880, 500 5120, 500 5500",
  "L 500 6000",
].join(" ");

const CLAUDE = "#d97757";
const SIDES: Array<"left" | "right" | "center"> = [
  "right",
  "left",
  "center",
  "right",
  "left",
  "center",
];
const FILE_ROT = ["-rotate-2", "rotate-1", "-rotate-1", "rotate-2"];

type Chapter = {
  label: string;
  title: ReactNode;
  body?: string;
  side: "left" | "right" | "center";
  icon?: boolean;
  extra?: ReactNode;
};

function titleNode(t: { titleLead: string; titleEm: string; titleTail: string }) {
  return (
    <>
      {t.titleLead} <em className="text-emerald">{t.titleEm}</em>
      {t.titleTail}
    </>
  );
}

function buildChapters(dict: Dictionary["story"]): Chapter[] {
  const c1 = dict.ch1;
  const c2 = dict.ch2;
  const c3 = dict.ch3;
  const c4 = dict.ch4;
  const c5 = dict.ch5;
  const c6 = dict.ch6;
  return [
    {
      label: c1.label,
      side: SIDES[0],
      title: titleNode(c1),
      body: c1.body,
      extra: (
        <div className="mt-6 space-y-2.5">
          {c1.tools.map((tool) => (
            <p
              key={tool.name}
              className="px-label flex items-center gap-3 border border-line bg-surface px-4 py-3 normal-case tracking-[0.04em]"
            >
              <PixelIcon rows={[...PX.sparkle]} className="h-4 w-4 shrink-0 text-[#d97757]" />
              <span style={{ color: CLAUDE }}>{tool.name}</span>
              <span className="text-muted">— {tool.desc}</span>
            </p>
          ))}
          <p className="px-label pt-3 text-emerald">{c1.toolsNote}</p>
        </div>
      ),
    },
    {
      label: c2.label,
      side: SIDES[1],
      title: titleNode(c2),
      body: c2.body,
      extra: (
        <div className="mt-6">
          <div className="flex flex-wrap gap-3">
            {c2.files.map((txt, i) => (
              <span
                key={txt}
                className={`px-label border border-line/40 bg-surface px-3 py-2 normal-case tracking-[0.04em] text-muted ${FILE_ROT[i] ?? ""}`}
              >
                {txt}
              </span>
            ))}
          </div>
          <p className="px-label mt-5 flex items-center gap-2 text-ink/80">
            {c2.chaosNote}
            <span aria-hidden="true" className="inline-block h-3 w-2 bg-line animate-blink" />
          </p>
        </div>
      ),
    },
    {
      label: c3.label,
      side: SIDES[2],
      icon: true,
      title: titleNode(c3),
      body: c3.body,
      extra: (
        <div className="mt-6 flex flex-wrap justify-center gap-2.5">
          {c3.badges.map((t) => (
            <span
              key={t}
              className="px-label border border-emerald/40 px-3 py-2 normal-case tracking-[0.04em] text-emerald"
            >
              {t}
            </span>
          ))}
        </div>
      ),
    },
    {
      label: c4.label,
      side: SIDES[3],
      title: titleNode(c4),
      body: c4.body,
      extra: (
        <div className="mt-6 border border-line bg-surface text-left">
          <p className="px-label border-b border-line px-4 py-3 text-muted">{c4.wizardHeader}</p>
          <div className="divide-y divide-seam">
            {c4.rows.map((row) => (
              <p
                key={row.q}
                className="px-label flex items-center justify-between gap-4 px-4 py-3 normal-case tracking-[0.04em]"
              >
                <span className="text-ink/85">{row.q}</span>
                <span className="shrink-0 text-emerald">[ {row.a} ]</span>
              </p>
            ))}
          </div>
          <div className="border-t border-line p-4">
            <span className="px-label inline-block bg-emerald px-6 py-3 text-white shadow-[5px_5px_0_0_rgba(5,150,105,0.25)]">
              {c4.create}
            </span>
            <p className="px-label mt-3 normal-case tracking-[0.04em] text-muted">
              {c4.doneText} <span className="text-emerald">{c4.doneOk}</span>
            </p>
          </div>
        </div>
      ),
    },
    {
      label: c5.label,
      side: SIDES[4],
      title: titleNode(c5),
      body: c5.body,
      extra: (
        <div className="mt-6">
          <div className="flex flex-wrap gap-2.5">
            {c5.chips.map((t) => (
              <span
                key={t}
                className="px-label border border-emerald/40 px-3 py-2 normal-case tracking-[0.04em] text-emerald"
              >
                {t}
              </span>
            ))}
          </div>
          <p className="px-label mt-5 text-emerald">{c5.resultNote}</p>
        </div>
      ),
    },
    {
      label: c6.label,
      side: SIDES[5],
      title: titleNode(c6),
      body: c6.body,
      extra: (
        <div className="mx-auto mt-6 max-w-md border border-line bg-surface p-5 text-left font-mono text-sm">
          <p className="text-ink/90">
            &gt; <span className="text-emerald">{c6.cmd}</span>
            <span aria-hidden="true" className="ml-1 inline-block h-3.5 w-2 bg-emerald animate-blink" />
          </p>
          <p className="mt-3 text-muted">
            {c6.labels.map((l, i) => (
              <span key={l}>
                {i > 0 ? " · " : ""}
                {l} <span className="text-emerald">✓</span>
              </span>
            ))}
          </p>
          <p className="mt-1 text-muted">
            {c6.shared} <span className="text-emerald">✓</span>
          </p>
        </div>
      ),
    },
  ];
}

function ChapterSection({ ch }: { ch: Chapter }) {
  const align =
    ch.side === "center"
      ? "mx-auto w-full max-w-2xl text-center"
      : ch.side === "right"
        ? "md:ml-auto md:w-[52%]"
        : "md:mr-auto md:w-[52%]";
  return (
    <section className="relative flex min-h-screen items-center px-5 py-24 sm:px-8">
      <div className="mx-auto w-full max-w-6xl">
        <Rise className={align}>
          <div className="border border-line bg-paper/85 p-7 backdrop-blur-sm sm:p-9">
            {ch.icon && (
              <PixelIcon rows={[...PX.ghost]} className="mx-auto mb-6 h-14 w-[68px] text-emerald" />
            )}
            <p className="px-label text-muted">{ch.label}</p>
            <h2 className="mt-4 text-balance font-display text-3xl font-semibold tracking-[-0.02em] text-ink sm:text-4xl md:text-[2.6rem] md:leading-[1.08]">
              {ch.title}
            </h2>
            {ch.body && <p className="mt-4 text-pretty leading-relaxed text-muted">{ch.body}</p>}
            {ch.extra}
          </div>
        </Rise>
      </div>
    </section>
  );
}

export function StoryJourney({
  locale,
  dict,
}: {
  locale: Locale;
  dict: Dictionary["story"];
}) {
  const chapters = buildChapters(dict);
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const glowRefs = useRef<Array<SVGPathElement | null>>([]);
  const headRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef(0);
  const [reached, setReached] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const path = pathRef.current;
    const head = headRef.current;
    if (!container || !path || !head) return;

    const L = path.getTotalLength();
    const drawn = [path, ...glowRefs.current.filter(Boolean)] as SVGPathElement[];

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      progressRef.current = 1;
      setReached(N);
      head.style.display = "none";
      return;
    }

    gsap.set(drawn, { strokeDasharray: L, strokeDashoffset: L });

    const place = (prog: number) => {
      const pt = path.getPointAtLength(L * prog);
      head.style.transform = `translate(${(pt.x / VB_W) * container.clientWidth}px, ${
        (pt.y / VB_H) * container.clientHeight
      }px)`;
    };

    let lit = 0;
    const tween = gsap.to(drawn, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: container,
        start: "top 50%",
        end: "bottom 50%",
        scrub: 0.6,
        onUpdate(self) {
          progressRef.current = self.progress;
          place(self.progress);
          const n = Math.min(N, Math.floor(self.progress * N + 0.5));
          if (n !== lit) {
            lit = n;
            setReached(n);
          }
        },
      },
    });
    place(0);

    return () => {
      tween.scrollTrigger?.kill();
      tween.kill();
    };
  }, []);

  return (
    <div className="relative">
      <StoryCanvas progressRef={progressRef} />

      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[1] bg-[radial-gradient(ellipse_80%_80%_at_50%_50%,rgba(247,248,243,0.35)_0%,rgba(247,248,243,0.72)_100%)]"
      />

      <div className="relative z-10">
        {/* Intro */}
        <section className="relative flex min-h-screen items-center">
          <div className="mx-auto w-full max-w-4xl px-5 text-center sm:px-8">
            <Rise>
              <p className="px-label text-emerald">{dict.intro.eyebrow}</p>
            </Rise>
            <Rise delay={0.1}>
              <h1 className="mt-7 text-balance font-display text-5xl font-semibold leading-[1.02] tracking-[-0.02em] text-ink sm:text-6xl md:text-7xl">
                {dict.intro.titleLead} <em className="text-emerald">{dict.intro.titleEm}</em>
              </h1>
            </Rise>
            <Rise delay={0.2}>
              <p className="px-label mt-10 flex items-center justify-center gap-2 text-muted">
                {dict.intro.scrollHint}
                <span aria-hidden="true" className="inline-block h-3 w-2 bg-emerald animate-blink" />
              </p>
            </Rise>
          </div>
        </section>

        {/* Scroll story: glowing path + chapters */}
        <div ref={containerRef} className="relative">
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full"
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            preserveAspectRatio="none"
          >
            <path d={PATH_D} fill="none" stroke="#D4DCD6" strokeWidth={2} vectorEffect="non-scaling-stroke" />
            <path
              ref={(el) => {
                glowRefs.current[0] = el;
              }}
              d={PATH_D}
              fill="none"
              stroke="#059669"
              strokeOpacity={0.1}
              strokeWidth={11}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path
              ref={(el) => {
                glowRefs.current[1] = el;
              }}
              d={PATH_D}
              fill="none"
              stroke="#059669"
              strokeOpacity={0.28}
              strokeWidth={5.5}
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
            />
            <path ref={pathRef} d={PATH_D} fill="none" stroke="#059669" strokeWidth={2.5} vectorEffect="non-scaling-stroke" />
          </svg>

          {chapters.map((ch, i) => (
            <div
              key={ch.label}
              aria-hidden="true"
              className="absolute z-[4]"
              style={{
                left: `${(NODE_X[i] / VB_W) * 100}%`,
                top: `${((i + 0.5) / N) * 100}%`,
              }}
            >
              <div
                className={`h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 border transition-all duration-500 ${
                  reached > i
                    ? "border-emerald bg-emerald shadow-[0_0_14px_3px_rgba(5,150,105,0.6)]"
                    : "border-emerald/40 bg-paper"
                }`}
              />
              <span
                className={`px-label absolute left-3 top-0 -translate-y-1/2 transition-colors duration-500 ${
                  reached > i ? "text-emerald" : "text-muted/60"
                }`}
              >
                0{i + 1}
              </span>
            </div>
          ))}

          <div
            ref={headRef}
            aria-hidden="true"
            className="absolute left-0 top-0 z-[5] h-3.5 w-3.5"
            style={{ marginLeft: -7, marginTop: -7 }}
          >
            <span className="absolute inset-0 animate-ping bg-emerald/40" />
            <span className="absolute inset-0 bg-emerald shadow-[0_0_16px_5px_rgba(5,150,105,0.75)]" />
          </div>

          {chapters.map((ch) => (
            <ChapterSection key={ch.label} ch={ch} />
          ))}
        </div>

        {/* Outro / CTA */}
        <section className="relative flex min-h-[85vh] items-center">
          <div className="mx-auto w-full max-w-3xl px-5 py-28 text-center sm:px-8">
            <Rise>
              <PixelIcon rows={[...PX.ghost]} className="mx-auto h-16 w-20 text-emerald" />
            </Rise>
            <Rise delay={0.1}>
              <h2 className="mt-10 text-balance font-display text-4xl font-semibold leading-[1.05] tracking-[-0.02em] text-ink sm:text-5xl md:text-6xl">
                {dict.outro.titleLead} <em className="text-emerald">{dict.outro.titleEm}</em>
              </h2>
            </Rise>
            <Rise delay={0.2}>
              <div className="mt-12 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <a
                  href={localizeHref("/waitlist", locale)}
                  className="px-label inline-flex items-center justify-center gap-2 bg-emerald px-9 py-4 text-white shadow-[6px_6px_0_0_rgba(5,150,105,0.25)] transition-all duration-200 hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[9px_9px_0_0_rgba(5,150,105,0.3)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-emerald"
                >
                  {dict.outro.ctaPrimary}
                </a>
                <a
                  href={localizeHref("/", locale)}
                  className="px-label inline-flex items-center justify-center border border-line/30 px-9 py-4 text-ink transition-all duration-200 hover:border-line hover:bg-ink/5"
                >
                  {dict.outro.ctaSecondary}
                </a>
              </div>
            </Rise>
            <Rise delay={0.3}>
              <p className="px-label mt-9 text-muted">{dict.outro.note}</p>
            </Rise>
          </div>
        </section>
      </div>
    </div>
  );
}
