"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Dictionary } from "@/lib/wg-copy";

// Decide whether to show the intro BEFORE the browser paints (no flash on
// repeat visits). Falls back to useEffect during SSR to avoid the warning.
const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

// Plays once per browsing session; clear sessionStorage key "wg-intro-seen"
// (or open a new tab/window) to see it again.
const INTRO_SEEN_KEY = "wg-intro-seen";

/**
 * Phantom.land-style intro: paper screen with a studio caption and a
 * loading bar, emerald particles converge into the ghost mark, the mark
 * solidifies and blinks, slides left while the WHITE GHOST wordmark types in,
 * then the curtain lifts to reveal the page. Plays once per browsing session
 * (persisted in sessionStorage): the first time in a session, then skipped while
 * navigating around — and skipped when arriving via an in-page anchor link.
 */

const EMERALD = "#059669";
const INK = "#10251C";
const PAPER = "#F7F8F3";
const FERN = "#4E8E73";

const GHOST_PATH =
  "M28 0C12.536 0 0 12.536 0 28v30a7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0V28C56 12.536 43.464 0 28 0Z";

// "WHITE GHOST" outlined from IBM Plex Mono Medium at fontSize 100, baseline
// y=0, 0.45em tracking baked into per-letter x offsets (advance 105/slot,
// the space between words is an empty slot).
const LETTERS = [
  "M22.500 0L7.500 0L2.500-69.800L12.300-69.800L14.800-29.200L15.900-11.300L16.700-11.300L24.600-52.900L35.700-52.900L43.600-11.300L44.400-11.300L45.500-29.200L48.100-69.800L57.500-69.800L52.500 0L37.500 0L30.400-40.400L29.600-40.400",
  "M146.600 0L146.600-30.700L123.400-30.700L123.400 0L112.200 0L112.200-69.800L123.400-69.800L123.400-40.100L146.600-40.100L146.600-69.800L157.800-69.800L157.800 0",
  "M262 0L218 0L218-8.500L234.400-8.500L234.400-61.300L218-61.300L218-69.800L262-69.800L262-61.300L245.600-61.300L245.600-8.500L262-8.500",
  "M372.500-60.400L350.600-60.400L350.600 0L339.400 0L339.400-60.400L317.500-60.400L317.500-69.800L372.500-69.800",
  "M472.300 0L428.600 0L428.600-69.800L472.300-69.800L472.300-60.400L439.800-60.400L439.800-40.100L471.100-40.100L471.100-30.700L439.800-30.700L439.800-9.400L472.300-9.400",
  "M673 0L673-9.600L672.300-9.600Q671.400-7.500 670.150-5.550Q668.900-3.600 667.050-2.100Q665.200-0.600 662.600 0.300Q660 1.200 656.600 1.200Q645.700 1.200 640.200-8.100Q634.700-17.400 634.700-34.400Q634.700-52.200 641-61.600Q647.300-71 660.300-71Q665.400-71 669.250-69.600Q673.100-68.200 675.800-65.850Q678.500-63.500 680.300-60.350Q682.100-57.200 683.200-53.700L673.100-50.300Q672.300-52.600 671.300-54.650Q670.300-56.700 668.850-58.300Q667.400-59.900 665.350-60.800Q663.300-61.700 660.400-61.700Q653.100-61.700 649.850-56.050Q646.600-50.400 646.600-40.800L646.600-29.700Q646.600-24.900 647.300-20.900Q648-16.900 649.650-14.050Q651.300-11.200 653.950-9.600Q656.600-8 660.400-8Q666.500-8 669.750-11.650Q673-15.300 673-21L673-27.300L659.500-27.300L659.500-35.700L683.200-35.700L683.200 0",
  "M776.600 0L776.600-30.700L753.400-30.700L753.400 0L742.200 0L742.200-69.800L753.400-69.800L753.400-40.100L776.600-40.100L776.600-69.800L787.800-69.800L787.800 0",
  "M870 1.200Q863.400 1.200 858.550-1.250Q853.700-3.700 850.550-8.300Q847.400-12.900 845.900-19.600Q844.400-26.300 844.400-34.900Q844.400-43.400 845.900-50.150Q847.400-56.900 850.550-61.500Q853.700-66.100 858.550-68.550Q863.400-71 870-71Q876.600-71 881.450-68.550Q886.300-66.100 889.450-61.500Q892.600-56.900 894.100-50.150Q895.600-43.400 895.600-34.900Q895.600-26.300 894.100-19.600Q892.600-12.900 889.450-8.300Q886.300-3.700 881.450-1.250Q876.600 1.200 870 1.200M870-8.100Q877.500-8.100 880.600-13.750Q883.700-19.400 883.700-29.100L883.700-40.800Q883.700-50.400 880.600-56.050Q877.500-61.700 870-61.700Q862.500-61.700 859.400-56.050Q856.300-50.400 856.300-40.800L856.300-29Q856.300-19.400 859.400-13.750Q862.500-8.100 870-8.100",
  "M974.400 1.200Q965.300 1.200 959.100-2Q952.900-5.200 948.900-10.500L956.100-17.400Q960.100-12.600 964.600-10.350Q969.100-8.100 974.800-8.100Q981.400-8.100 984.950-11.100Q988.500-14.100 988.500-19.700Q988.500-24.200 985.900-26.650Q983.300-29.100 977-30.200L969.400-31.400Q964.400-32.200 961-34.050Q957.600-35.900 955.500-38.450Q953.400-41 952.450-44.150Q951.500-47.300 951.500-50.800Q951.500-60.700 957.900-65.850Q964.300-71 975.500-71Q983.800-71 989.650-68.350Q995.500-65.700 999.100-60.900L992.100-53.900Q989.200-57.400 985.250-59.550Q981.300-61.700 975.500-61.700Q969.300-61.700 966.050-59.050Q962.800-56.400 962.800-51.300Q962.800-47 965.350-44.550Q967.900-42.100 974.400-41L981.800-39.700Q991.200-38 995.500-32.850Q999.800-27.700 999.800-20.300Q999.800-15.500 998.150-11.500Q996.500-7.500 993.250-4.700Q990-1.900 985.250-0.350Q980.500 1.200 974.400 1.200",
  "M1107.500-60.400L1085.600-60.400L1085.600 0L1074.400 0L1074.400-60.400L1052.500-60.400L1052.500-69.800L1107.500-69.800",
];

// Lockup geometry — must match public/logo.svg
const LOCKUP_W = 500;
const LOCKUP_H = 66;
// Padding around the drawing (like logo.svg's viewBox "-2 -2 504 70"): the
// ghost's 2.5 stroke is centered on the path, so without it the outline gets
// clipped at the left/top/bottom edges of the SVG.
const LOCKUP_PAD = 2;
const VIEW_W = LOCKUP_W + LOCKUP_PAD * 2;
const VIEW_H = LOCKUP_H + LOCKUP_PAD * 2;
const TEXT_X = 86; // 56 (ghost) + 30 (gap)
const BASELINE_Y = 46; // 33 + capHeight 26 / 2
const TEXT_SCALE = 0.37249; // capHeight 26 / 69.8

const EASE = [0.76, 0, 0.24, 1] as const;

type Phase = "form" | "solid" | "word" | "exit";

type Particle = {
  tx: number;
  ty: number;
  sx: number;
  sy: number;
  delay: number;
  dur: number;
  r: number;
  a: number;
};

export function IntroLoader({ dict }: { dict: Dictionary["intro"] }) {
  const reduce = useReducedMotion();
  const [done, setDone] = useState(false);
  const [phase, setPhase] = useState<Phase>("form");
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ghostRef = useRef<SVGPathElement>(null);
  // Wrapper around the lockup; shifted right so the ghost starts
  // screen-centered, then slid back to 0 for the wordmark. Plain DOM
  // transforms — framer-motion drops externally-updated style values.
  const wrapRef = useRef<HTMLDivElement>(null);
  const phaseRef = useRef<Phase>("form");
  phaseRef.current = phase;

  const finish = useCallback(() => {
    setDone(true);
  }, []);

  const skip = useCallback(() => {
    if (phaseRef.current !== "exit") setPhase("exit");
  }, []);

  // Decide whether to play the intro at all (before paint, no flash):
  //  1. Arriving with a hash (e.g. "/es/#product" from another page) → skip and
  //     jump to that section.
  //  2. Already seen on this device → skip.
  //  3. Otherwise → mark as seen and play it this once.
  useIsoLayoutEffect(() => {
    const hash = window.location.hash;
    if (hash && hash.length > 1) {
      setDone(true);
      const id = decodeURIComponent(hash.slice(1));
      const raf = requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          document.getElementById(id)?.scrollIntoView({ block: "start" });
        })
      );
      return () => cancelAnimationFrame(raf);
    }
    let seen = false;
    try {
      seen = sessionStorage.getItem(INTRO_SEEN_KEY) === "1";
    } catch {}
    if (seen) {
      setDone(true);
      return;
    }
    try {
      sessionStorage.setItem(INTRO_SEEN_KEY, "1");
    } catch {}
  }, []);

  // Lock scroll while the intro is up.
  useEffect(() => {
    if (done) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [done]);

  // Timeline. Reduced motion: shorter hold on the static lockup, then exit.
  useEffect(() => {
    if (done) return;
    let slow = 1;
    try {
      slow = Number(sessionStorage.getItem("wg-intro-slow")) || 1;
    } catch {}
    const ms = (t: number) => (reduce ? t * 0.45 : t) * slow;
    const timers = [
      setTimeout(() => setPhase((p) => (p === "form" ? "solid" : p)), ms(2050)),
      setTimeout(() => setPhase((p) => (p === "solid" ? "word" : p)), ms(2600)),
      setTimeout(() => setPhase((p) => (p === "exit" ? p : "exit")), ms(3700)),
    ];
    return () => timers.forEach(clearTimeout);
  }, [done, reduce]);

  // Position the lockup so the ghost starts screen-centered, then build the
  // particle field that converges into the measured ghost silhouette.
  useEffect(() => {
    if (done || reduce) return;
    const ghostEl = ghostRef.current;
    const canvas = canvasRef.current;
    if (!ghostEl || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const svgW = ghostEl.ownerSVGElement!.getBoundingClientRect().width;
    const s = svgW / VIEW_W;
    // viewBox center is at LOCKUP_W / 2 (pad is symmetric); ghost center at 28.
    const shift = (LOCKUP_W / 2 - 28) * s;
    if (wrapRef.current) {
      // Clear any transition left from a previous run (the slide below, or
      // a DOM node reused across remounts) so the shift lands instantly
      // before we measure.
      wrapRef.current.style.transition = "none";
      wrapRef.current.style.transform = `translateX(${shift}px)`;
    }

    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = vw * dpr;
    canvas.height = vh * dpr;

    // Measure the ghost's box (the wrapper transform above is already
    // applied) and sample its silhouette — eyes carved out — on an
    // offscreen canvas.
    const rect = ghostEl.getBoundingClientRect();
    const gs = rect.width / 56;
    const k = 4;
    const off = document.createElement("canvas");
    off.width = 56 * k;
    off.height = 66 * k;
    const octx = off.getContext("2d")!;
    octx.scale(k, k);
    octx.fillStyle = "#fff";
    octx.fill(new Path2D(GHOST_PATH));
    octx.clearRect(17.5, 24, 7, 15);
    octx.clearRect(31.5, 24, 7, 15);
    const img = octx.getImageData(0, 0, off.width, off.height).data;

    const pts: Array<[number, number]> = [];
    for (let y = 0; y < 66 * k; y += 2) {
      for (let x = 0; x < 56 * k; x += 2) {
        if (img[(y * 56 * k + x) * 4 + 3] > 128 && Math.random() < 0.35) {
          pts.push([rect.left + (x / k) * gs, rect.top + (y / k) * gs]);
        }
      }
    }

    const particles: Particle[] = pts.map(([tx, ty]) => ({
      tx,
      ty,
      sx: tx + (Math.random() - 0.5) * vw * 1.1,
      sy: ty + (Math.random() - 0.5) * vh * 1.1,
      delay: 250 + Math.random() * 500,
      dur: 850 + Math.random() * 550,
      r: (0.5 + Math.random()) * gs * 0.45,
      a: 0.55 + Math.random() * 0.45,
    }));

    let alive = true;
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      if (!alive) return;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, vw, vh);
      const t = now - start;
      for (const p of particles) {
        const u = Math.min(1, Math.max(0, (t - p.delay) / p.dur));
        if (u === 0) continue;
        const e = 1 - Math.pow(1 - u, 3);
        ctx.globalAlpha = Math.min(1, u * 2.5) * p.a;
        ctx.fillStyle = EMERALD;
        ctx.beginPath();
        ctx.arc(
          p.sx + (p.tx - p.sx) * e,
          p.sy + (p.ty - p.sy) * e,
          p.r,
          0,
          Math.PI * 2
        );
        ctx.fill();
      }
      if (phaseRef.current === "form") raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => {
      alive = false;
      cancelAnimationFrame(raf);
    };
  }, [done, reduce]);

  // Slide the lockup to its centered position when the wordmark appears.
  useEffect(() => {
    if (done || !wrapRef.current) return;
    if (phase === "word") {
      const el = wrapRef.current;
      el.style.transition = "transform 650ms cubic-bezier(0.76, 0, 0.24, 1)";
      el.style.transform = "translateX(0px)";
    }
  }, [phase, done]);

  if (done) return null;

  const solidVisible = phase !== "form";
  const wordVisible = phase === "word" || phase === "exit";

  return (
    <motion.div
      id="wg-intro"
      className="fixed inset-0 z-[9999] cursor-pointer overflow-hidden"
      style={{ backgroundColor: PAPER }}
      onClick={skip}
      aria-hidden="true"
      animate={phase === "exit" ? { y: "-100%" } : { y: 0 }}
      transition={{ duration: 0.7, ease: EASE }}
      onAnimationComplete={() => {
        if (phaseRef.current === "exit") finish();
      }}
    >
      {/* Studio caption, phantom.land style */}
      <div className="absolute inset-x-0 top-[34%] flex justify-center">
        <motion.p
          className="whitespace-nowrap font-mono text-[11px] tracking-[0.18em] sm:text-[13px]"
          initial={{ opacity: 0 }}
          animate={{ opacity: solidVisible ? 0 : 1 }}
          transition={{ duration: 0.5, delay: solidVisible ? 0 : 0.2 }}
        >
          <span style={{ color: INK }}>{dict.brand}</span>
          <span style={{ color: FERN }}>&nbsp;&nbsp;{dict.caption}</span>
        </motion.p>
      </div>

      {/* Converging particles */}
      {!reduce && (
        <motion.canvas
          ref={canvasRef}
          className="absolute inset-0 h-full w-full"
          animate={{ opacity: solidVisible ? 0 : 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Lockup: ghost solidifies and blinks, then slides left as GHOSTY types in */}
      <div ref={wrapRef} className="absolute inset-0 flex items-center justify-center">
        <motion.svg
          viewBox={`${-LOCKUP_PAD} ${-LOCKUP_PAD} ${VIEW_W} ${VIEW_H}`}
          style={{ width: "min(88vw, 980px)" }}
          initial={false}
          animate={{ opacity: solidVisible || reduce ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <path ref={ghostRef} d={GHOST_PATH} fill="#FFFFFF" stroke={INK} strokeWidth={2.5} />
          {[17.5, 31.5].map((x) => (
            <motion.rect
              key={x}
              x={x}
              y={24}
              width={7}
              height={15}
              rx={2}
              fill={INK}
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              animate={
                solidVisible ? { scaleY: [1, 1, 0.1, 1] } : { scaleY: 1 }
              }
              transition={{ duration: 0.45, times: [0, 0.45, 0.7, 1] }}
            />
          ))}
          <g transform={`translate(${TEXT_X} ${BASELINE_Y}) scale(${TEXT_SCALE})`}>
            {LETTERS.map((d, i) => (
              <motion.path
                key={i}
                d={d}
                fill={INK}
                initial={false}
                animate={
                  wordVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }
                }
                transition={{
                  duration: 0.35,
                  delay: wordVisible ? 0.12 + i * 0.055 : 0,
                  ease: "easeOut",
                }}
              />
            ))}
          </g>
        </motion.svg>
      </div>

      {/* Loading bar, bottom edge */}
      <motion.div
        className="absolute bottom-0 left-0 h-[3px]"
        style={{ backgroundColor: EMERALD }}
        initial={{ width: "0%" }}
        animate={{ width: "100%", opacity: solidVisible ? 0 : 1 }}
        transition={{
          width: { duration: 1.9, ease: [0.3, 0.6, 0.4, 1] },
          opacity: { duration: 0.4 },
        }}
      />
    </motion.div>
  );
}
