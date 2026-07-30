"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { PX } from "@/components/wg/PixelBits";

type Weights = [number, number, number, number]; // calm, chaos, ghost, grid

/**
 * Scroll-driven keyframes for the particle field. As the story progresses
 * the cloud drifts calmly (the human working), scatters into chaos (files
 * everywhere), converges into the GHOSTY sprite (White Ghost appears) and
 * finally settles into an ordered lattice (everything under control).
 */
const KEYS: { p: number; w: Weights; color: THREE.Color }[] = [
  { p: 0.0, w: [1, 0, 0, 0], color: new THREE.Color("#4E8E73") },
  { p: 0.13, w: [1, 0, 0, 0], color: new THREE.Color("#4E8E73") },
  { p: 0.25, w: [0, 1, 0, 0], color: new THREE.Color("#D4DCD6") },
  { p: 0.36, w: [0, 1, 0, 0], color: new THREE.Color("#D4DCD6") },
  { p: 0.47, w: [0, 0, 1, 0], color: new THREE.Color("#059669") },
  { p: 0.76, w: [0, 0, 1, 0], color: new THREE.Color("#059669") },
  { p: 0.9, w: [0, 0, 0, 1], color: new THREE.Color("#059669") },
  { p: 1.0, w: [0, 0, 0, 1], color: new THREE.Color("#059669") },
];

const COUNT = 1200;

export function StoryCanvas({ progressRef }: { progressRef: { current: number } }) {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      55,
      mount.clientWidth / mount.clientHeight,
      0.1,
      200
    );
    camera.position.z = 17;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    mount.appendChild(renderer.domElement);

    const rand = (s: number) => (Math.random() - 0.5) * 2 * s;

    const calm = new Float32Array(COUNT * 3);
    const chaos = new Float32Array(COUNT * 3);
    const ghost = new Float32Array(COUNT * 3);
    const grid = new Float32Array(COUNT * 3);
    const seeds = new Float32Array(COUNT * 2);

    // Solid cells of the GHOSTY sprite — particles converge onto these.
    const cells: Array<[number, number]> = [];
    PX.ghost.forEach((row, y) =>
      [...row].forEach((ch, x) => {
        if (ch === "#") cells.push([x, y]);
      })
    );
    const GW = PX.ghost[0].length;
    const GH = PX.ghost.length;
    const S = 1.15; // world units per sprite pixel

    for (let i = 0; i < COUNT; i++) {
      calm.set([rand(14), rand(8), rand(6)], i * 3);
      chaos.set([rand(24), rand(13), rand(9)], i * 3);
      const [cx, cy] = cells[i % cells.length];
      ghost.set(
        [
          (cx - (GW - 1) / 2 + rand(0.42)) * S,
          ((GH - 1) / 2 - cy + rand(0.42)) * S,
          rand(0.5),
        ],
        i * 3
      );
      const gx = i % 15;
      const gy = Math.floor(i / 15) % 10;
      const gz = Math.floor(i / 150);
      grid.set([(gx - 7) * 1.7, (gy - 4.5) * 1.45, (gz - 3.5) * 1.3], i * 3);
      seeds.set([Math.random() * Math.PI * 2, 0.4 + Math.random() * 1.4], i * 2);
    }

    const cur = reduced ? ghost.slice() : calm.slice();
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute("position", new THREE.BufferAttribute(cur, 3));

    // Untextured points render as squares — matches the big-pixel identity.
    const material = new THREE.PointsMaterial({
      color: new THREE.Color("#4E8E73"),
      size: 0.13,
      transparent: true,
      opacity: 0.85,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(geometry, material);
    scene.add(points);

    const w: Weights = [1, 0, 0, 0];
    const col = new THREE.Color();
    const sample = (p: number) => {
      let k = 0;
      while (k < KEYS.length - 2 && p > KEYS[k + 1].p) k++;
      const a = KEYS[k];
      const b = KEYS[k + 1];
      let u = Math.min(1, Math.max(0, (p - a.p) / (b.p - a.p || 1)));
      u = u * u * (3 - 2 * u);
      for (let j = 0; j < 4; j++) w[j] = a.w[j] + (b.w[j] - a.w[j]) * u;
      col.copy(a.color).lerp(b.color, u);
    };

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.016;
      const p = Math.min(1, Math.max(0, progressRef.current));
      sample(p);
      const jitter = 0.16 + w[1] * 1.7;
      for (let i = 0; i < COUNT; i++) {
        const j = i * 3;
        const ph = seeds[i * 2];
        const sp = seeds[i * 2 + 1];
        const wobX = Math.sin(t * sp + ph) * jitter;
        const wobY = Math.cos(t * sp * 0.8 + ph * 2) * jitter;
        const tx = calm[j] * w[0] + chaos[j] * w[1] + ghost[j] * w[2] + grid[j] * w[3] + wobX;
        const ty =
          calm[j + 1] * w[0] + chaos[j + 1] * w[1] + ghost[j + 1] * w[2] + grid[j + 1] * w[3] + wobY;
        const tz =
          calm[j + 2] * w[0] + chaos[j + 2] * w[1] + ghost[j + 2] * w[2] + grid[j + 2] * w[3];
        cur[j] += (tx - cur[j]) * 0.06;
        cur[j + 1] += (ty - cur[j + 1]) * 0.06;
        cur[j + 2] += (tz - cur[j + 2]) * 0.06;
      }
      geometry.attributes.position.needsUpdate = true;
      material.color.copy(col);
      material.opacity = 0.55 + 0.35 * w[2];
      camera.position.z = 17 - 2.5 * p;
      points.rotation.y = (1 - w[2]) * 0.22 * Math.sin(t * 0.12);
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };

    if (reduced) {
      material.color.set("#059669");
      renderer.render(scene, camera);
    } else {
      raf = requestAnimationFrame(tick);
    }

    const onResize = () => {
      camera.aspect = mount.clientWidth / mount.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mount.clientWidth, mount.clientHeight);
      if (reduced) renderer.render(scene, camera);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      scene.remove(points);
      geometry.dispose();
      material.dispose();
      renderer.dispose();
      mount.removeChild(renderer.domElement);
    };
  }, [progressRef]);

  return (
    <div
      ref={mountRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0"
    />
  );
}
