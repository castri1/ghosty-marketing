"use client";

import { useEffect, useRef } from "react";

/**
 * Interactive big-pixel texture for the alt hero.
 *
 * A coarse grid of square cells on the dark canvas. A dithered ghost
 * silhouette breathes on the right; moving the pointer pours light into
 * nearby cells, which decays in chunky quantized steps so the trail feels
 * pixelated rather than airbrushed. A slow diagonal wave plus sparse
 * sparkles keep it alive when idle. Pauses off-screen and respects
 * prefers-reduced-motion (static dithered ghost only).
 */

const EMERALD = [5, 150, 105] as const;
const INK = [16, 37, 28] as const;

const GHOST_PATH =
  "M28 0C12.536 0 0 12.536 0 28v30a7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0 7 7 0 0 0 14 0V28C56 12.536 43.464 0 28 0Z";

// 4x4 Bayer matrix for ordered dithering of the ghost fill.
const BAYER = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

export function PixelField({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    let cols = 0;
    let rows = 0;
    let cell = 26;
    let grid = new Float32Array(0); // pointer/wave energy per cell
    let ghost = new Float32Array(0); // dithered ghost base per cell
    let width = 0;
    let height = 0;

    function rebuild() {
      const rect = canvas!.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      canvas!.width = Math.max(1, Math.round(width * dpr));
      canvas!.height = Math.max(1, Math.round(height * dpr));
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);

      cell = width < 640 ? 20 : width < 1024 ? 24 : 28;
      cols = Math.ceil(width / cell);
      rows = Math.ceil(height / cell);
      grid = new Float32Array(cols * rows);
      ghost = new Float32Array(cols * rows);

      // Sample the ghost silhouette into the cell grid (eyes carved out),
      // anchored right of center, ~78% of the field height.
      const k = 4;
      const off = document.createElement("canvas");
      off.width = 56 * k;
      off.height = 66 * k;
      const octx = off.getContext("2d");
      if (!octx) return;
      octx.scale(k, k);
      octx.fill(new Path2D(GHOST_PATH));
      octx.clearRect(17.5, 24, 7, 15);
      octx.clearRect(31.5, 24, 7, 15);
      const img = octx.getImageData(0, 0, off.width, off.height).data;

      const gh = height * 0.78;
      const gw = gh * (56 / 66);
      const isNarrow = width < 768;
      // Centered on small screens (behind the copy, very faint), right side otherwise.
      const gx = isNarrow ? (width - gw) / 2 : width * 0.74 - gw / 2;
      const gy = (height - gh) / 2;

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const px = c * cell + cell / 2;
          const py = r * cell + cell / 2;
          const u = (px - gx) / gw;
          const v = (py - gy) / gh;
          if (u < 0 || u > 1 || v < 0 || v > 1) continue;
          const sx = Math.min(56 * k - 1, Math.floor(u * 56 * k));
          const sy = Math.min(66 * k - 1, Math.floor(v * 66 * k));
          if (img[(sy * 56 * k + sx) * 4 + 3] > 128) {
            // Ordered dither: drop ~35% of cells for a retro halftone fill.
            const b = BAYER[r % 4][c % 4] / 16;
            ghost[r * cols + c] = b < 0.65 ? (isNarrow ? 0.1 : 0.16) : 0;
          }
        }
      }
    }

    rebuild();

    // ——— Static fallback for reduced motion: draw once, no loop. ———
    if (reduce) {
      ctx.clearRect(0, 0, width, height);
      for (let i = 0; i < ghost.length; i++) {
        if (!ghost[i]) continue;
        const c = i % cols;
        const r = (i / cols) | 0;
        ctx.fillStyle = `rgba(${EMERALD[0]},${EMERALD[1]},${EMERALD[2]},${ghost[i] + 0.06})`;
        ctx.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2);
      }
      const onResize = () => rebuild();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    }

    // ——— Live mode ———
    let px = -1e4;
    let py = -1e4;
    let lastX = px;
    let lastY = py;

    function inject(x: number, y: number, amount: number) {
      const radius = 2.6;
      const c0 = Math.floor(x / cell);
      const r0 = Math.floor(y / cell);
      const span = Math.ceil(radius);
      for (let dr = -span; dr <= span; dr++) {
        for (let dc = -span; dc <= span; dc++) {
          const c = c0 + dc;
          const r = r0 + dr;
          if (c < 0 || c >= cols || r < 0 || r >= rows) continue;
          const d = Math.hypot(dc, dr);
          if (d > radius) continue;
          const i = r * cols + c;
          grid[i] = Math.min(1.25, grid[i] + amount * (1 - d / radius));
        }
      }
    }

    const onPointer = (e: PointerEvent) => {
      const rect = canvas!.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      if (lastX < -1e3) {
        lastX = x;
        lastY = y;
      }
      // Stamp along the segment so fast moves leave an unbroken trail.
      const steps = Math.max(1, Math.ceil(Math.hypot(x - lastX, y - lastY) / (cell * 0.8)));
      for (let s = 1; s <= steps; s++) {
        inject(lastX + ((x - lastX) * s) / steps, lastY + ((y - lastY) * s) / steps, 0.55);
      }
      lastX = px = x;
      lastY = py = y;
    };
    const onLeave = () => {
      px = py = lastX = lastY = -1e4;
    };

    const host = canvas.parentElement ?? canvas;
    host.addEventListener("pointermove", onPointer as EventListener, { passive: true });
    host.addEventListener("pointerdown", onPointer as EventListener, { passive: true });
    host.addEventListener("pointerleave", onLeave);

    let raf = 0;
    let running = true;
    let visible = true;
    let t = 0;

    const tick = () => {
      if (!running || !visible) return;
      t += 1;
      ctx.clearRect(0, 0, width, height);

      const breath = 0.75 + 0.25 * Math.sin(t * 0.015);

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c;

          // Decay pointer energy; ride a faint diagonal wave underneath.
          let v = grid[i] * 0.93;
          grid[i] = v < 0.012 ? 0 : v;
          const wave =
            0.028 *
            Math.max(0, Math.sin((c + r) * 0.55 - t * 0.02)) *
            Math.max(0, Math.sin(c * 0.13 + t * 0.007));

          let a = grid[i] + ghost[i] * breath + wave;
          if (a <= 0.02) continue;

          // Quantize alpha to 6 chunky steps — the retro feel lives here.
          a = Math.min(1, Math.ceil(a * 6) / 6);

          const hot = grid[i] > 0.85;
          const col = hot ? INK : EMERALD;
          ctx.fillStyle = `rgba(${col[0]},${col[1]},${col[2]},${(a * 0.85).toFixed(3)})`;
          ctx.fillRect(c * cell + 1, r * cell + 1, cell - 2, cell - 2);
        }
      }

      // Sparse idle sparkles, one cell at a time.
      if (t % 9 === 0) {
        const i = (Math.random() * grid.length) | 0;
        grid[i] = Math.max(grid[i], 0.32);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && running) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    });
    io.observe(canvas);

    const onVisibility = () => {
      if (document.visibilityState === "visible" && running && visible) {
        cancelAnimationFrame(raf);
        raf = requestAnimationFrame(tick);
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    let resizeTimer = 0;
    const onResize = () => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(rebuild, 120);
    };
    window.addEventListener("resize", onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      host.removeEventListener("pointermove", onPointer as EventListener);
      host.removeEventListener("pointerdown", onPointer as EventListener);
      host.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className={className ?? "absolute inset-0 h-full w-full"}
    />
  );
}
