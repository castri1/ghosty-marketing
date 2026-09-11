"use client";

/**
 * ColorLab — panel de ensayo de color (SOLO en la rama `ensayo-color-rosa`).
 *
 * Flota en la esquina superior derecha y reescribe en caliente los tokens de
 * color del sitio (wg.css @theme + los alias .mkt de marketing.css) inyectando
 * una hoja de estilo al final del <head>, que gana por orden de documento.
 * El canvas del fantasma (PixelField) no lee CSS, asi que se le avisa con el
 * evento `wg-colorlab`.
 *
 * No va a produccion: se monta solo cuando NODE_ENV !== 'production'.
 */

import { useCallback, useEffect, useState } from "react";

const STORAGE_KEY = "wg-colorlab";
const STYLE_ID = "wg-colorlab-style";

const PRESETS: { name: string; hex: string }[] = [
  { name: "Rosa", hex: "#FF0090" },
  { name: "Rosa CTA", hex: "#D6007A" },
  { name: "Esmeralda", hex: "#059669" },
  { name: "Violeta", hex: "#4929B0" },
  { name: "Azul", hex: "#476AFF" },
  { name: "Naranja", hex: "#EA580C" },
  { name: "Cian", hex: "#0891B2" },
  { name: "Tinta", hex: "#111827" },
];

/* ——— color math ——— */

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "").trim();
  const full =
    h.length === 3
      ? h
          .split("")
          .map((c) => c + c)
          .join("")
      : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function isHex(v: string) {
  return /^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(v.trim());
}

function rgbToHsl(r: number, g: number, b: number): [number, number, number] {
  const rr = r / 255;
  const gg = g / 255;
  const bb = b / 255;
  const max = Math.max(rr, gg, bb);
  const min = Math.min(rr, gg, bb);
  const l = (max + min) / 2;
  if (max === min) return [0, 0, l * 100];
  const d = max - min;
  const s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
  let h = 0;
  if (max === rr) h = ((gg - bb) / d + (gg < bb ? 6 : 0)) / 6;
  else if (max === gg) h = ((bb - rr) / d + 2) / 6;
  else h = ((rr - gg) / d + 4) / 6;
  return [h * 360, s * 100, l * 100];
}

function hsl(h: number, s: number, l: number) {
  return `hsl(${h.toFixed(1)} ${s.toFixed(1)}% ${l.toFixed(1)}%)`;
}

/** Luminancia relativa WCAG. */
function luminance([r, g, b]: [number, number, number]) {
  const f = (c: number) => {
    const v = c / 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
}

function contrastWithWhite(rgb: [number, number, number]) {
  return 1.05 / (luminance(rgb) + 0.05);
}

/* ——— la hoja de estilo que se inyecta ——— */

function buildCss(accentHex: string, tintNeutrals: boolean) {
  const rgb = hexToRgb(accentHex);
  const [h, s, l] = rgbToHsl(...rgb);
  const triplet = rgb.join(" ");

  // El hover de marketing.css espera canales "R G B", no hsl().
  const hoverTriplet = rgb.map((c) => Math.round(c * 0.82)).join(" ");
  const dim = hsl(h, Math.max(18, s * 0.45), Math.min(62, l + 18));

  // Neutros: o se tinen con el matiz del acento, o quedan grises limpios.
  const ns = tintNeutrals ? s : 0;
  const paper = hsl(h, Math.min(30, ns * 0.3), 97.6);
  const surface = "#ffffff";
  const mist = hsl(h, Math.min(70, ns * 0.7), 95.4);
  const line = hsl(h, Math.min(20, ns * 0.2), 87.5);
  const ink = hsl(h, Math.min(35, ns * 0.35), 11);
  const muted = hsl(h, Math.min(14, ns * 0.14), 37);

  return `
:root, .mkt, body {
  --color-emerald: ${accentHex};
  --color-mint: ${accentHex};
  --color-fern: ${dim};
  --color-paper: ${paper};
  --color-surface: ${surface};
  --color-mist: ${mist};
  --color-cream: ${mist};
  --color-line: ${line};
  --color-seam: ${line};
  --color-sand: ${line};
  --color-ink: ${ink};
  --color-pitch: ${ink};
  --color-muted: ${muted};
  --color-moss: ${muted};
  --color-bark: ${muted};

  --wg-accent-rgb: ${triplet};
  --accent: ${triplet};
  --accent-hover: ${hoverTriplet};
  --focus: ${triplet};
  --mk-phosphor: rgb(${triplet});
  --mk-phosphor-dim: ${dim};
}
`;
}

function applyColors(accentHex: string, tintNeutrals: boolean) {
  let el = document.getElementById(STYLE_ID) as HTMLStyleElement | null;
  if (!el) {
    el = document.createElement("style");
    el.id = STYLE_ID;
    document.head.appendChild(el);
  }
  el.textContent = buildCss(accentHex, tintNeutrals);
  window.dispatchEvent(
    new CustomEvent("wg-colorlab", { detail: { accent: accentHex } }),
  );
}

/* ——— componente ——— */

export function ColorLab() {
  const [accent, setAccent] = useState("#FF0090");
  const [draft, setDraft] = useState("#FF0090");
  const [tint, setTint] = useState(true);
  const [open, setOpen] = useState(true);
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);

  // Estado guardado (sobrevive recargas mientras iteras).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as {
          accent?: string;
          tint?: boolean;
          open?: boolean;
        };
        if (saved.accent && isHex(saved.accent)) {
          setAccent(saved.accent);
          setDraft(saved.accent);
        }
        if (typeof saved.tint === "boolean") setTint(saved.tint);
        if (typeof saved.open === "boolean") setOpen(saved.open);
      }
    } catch {
      /* localStorage bloqueado: seguimos con los valores por defecto */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    applyColors(accent, tint);
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ accent, tint, open }),
      );
    } catch {
      /* sin persistencia, no pasa nada */
    }
  }, [accent, tint, open, ready]);

  const commitDraft = useCallback(
    (value: string) => {
      setDraft(value);
      if (isHex(value)) {
        setAccent(value.startsWith("#") ? value : `#${value}`);
      }
    },
    [],
  );

  const pick = useCallback((hex: string) => {
    setAccent(hex);
    setDraft(hex);
  }, []);

  const copy = useCallback(() => {
    navigator.clipboard?.writeText(accent).then(
      () => {
        setCopied(true);
        setTimeout(() => setCopied(false), 1200);
      },
      () => setCopied(false),
    );
  }, [accent]);

  const ratio = contrastWithWhite(hexToRgb(accent));
  const ratioLabel = ratio.toFixed(2);
  const ratioOk = ratio >= 4.5;

  // Debajo de la nav fija (76px) para no tapar el CTA del header, que es
  // justo una de las cosas que uno quiere ver al cambiar el acento.
  const box: React.CSSProperties = {
    position: "fixed",
    top: 76,
    right: 12,
    zIndex: 2147483000,
    fontFamily:
      "'IBM Plex Mono', ui-monospace, SFMono-Regular, Menlo, monospace",
    fontSize: 11,
    color: "#111",
  };

  if (!open) {
    return (
      <div style={box}>
        <button
          type="button"
          onClick={() => setOpen(true)}
          title="Abrir el laboratorio de color"
          style={{
            width: 34,
            height: 34,
            borderRadius: 999,
            border: "2px solid rgba(0,0,0,.25)",
            background: accent,
            cursor: "pointer",
            boxShadow: "0 4px 14px rgba(0,0,0,.18)",
          }}
        />
      </div>
    );
  }

  return (
    <div style={box}>
      <div
        style={{
          width: 260,
          background: "rgba(255,255,255,.94)",
          backdropFilter: "blur(8px)",
          border: "1px solid rgba(0,0,0,.12)",
          borderRadius: 12,
          boxShadow: "0 10px 30px rgba(0,0,0,.16)",
          padding: 12,
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr)",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            letterSpacing: ".14em",
            textTransform: "uppercase",
            fontSize: 9,
            opacity: 0.6,
          }}
        >
          <span>Ensayo de color</span>
          <button
            type="button"
            onClick={() => setOpen(false)}
            title="Minimizar"
            style={{
              border: "none",
              background: "transparent",
              cursor: "pointer",
              fontSize: 13,
              lineHeight: 1,
              padding: 0,
              opacity: 0.7,
            }}
          >
            ×
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            type="color"
            value={accent}
            onChange={(e) => pick(e.target.value.toUpperCase())}
            style={{
              width: 42,
              height: 34,
              padding: 0,
              border: "1px solid rgba(0,0,0,.15)",
              borderRadius: 8,
              background: "transparent",
              cursor: "pointer",
            }}
          />
          <input
            type="text"
            value={draft}
            onChange={(e) => commitDraft(e.target.value)}
            spellCheck={false}
            style={{
              flex: 1,
              minWidth: 0,
              height: 34,
              padding: "0 8px",
              border: "1px solid rgba(0,0,0,.15)",
              borderRadius: 8,
              font: "inherit",
              textTransform: "uppercase",
            }}
          />
          <button
            type="button"
            onClick={copy}
            title="Copiar el hex"
            style={{
              height: 34,
              padding: "0 8px",
              border: "1px solid rgba(0,0,0,.15)",
              borderRadius: 8,
              background: "#fff",
              cursor: "pointer",
              font: "inherit",
            }}
          >
            {copied ? "ok" : "copiar"}
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 5,
          }}
        >
          {PRESETS.map((p) => (
            <button
              key={p.hex}
              type="button"
              onClick={() => pick(p.hex)}
              title={`${p.name} ${p.hex}`}
              style={{
                height: 22,
                borderRadius: 5,
                cursor: "pointer",
                background: p.hex,
                border:
                  p.hex.toUpperCase() === accent.toUpperCase()
                    ? "2px solid #111"
                    : "1px solid rgba(0,0,0,.15)",
              }}
            />
          ))}
        </div>

        <label
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={tint}
            onChange={(e) => setTint(e.target.checked)}
          />
          <span>tenir los neutros con el matiz</span>
        </label>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid rgba(0,0,0,.1)",
            paddingTop: 8,
          }}
        >
          <span style={{ opacity: 0.65 }}>blanco sobre el acento</span>
          <span
            style={{
              fontWeight: 600,
              color: ratioOk ? "#15803d" : "#b91c1c",
            }}
            title={
              ratioOk
                ? "Cumple WCAG AA para texto pequeno"
                : "Por debajo de 4.5:1, el texto pequeno en blanco no cumple AA"
            }
          >
            {ratioLabel}:1 {ratioOk ? "AA" : "bajo"}
          </span>
        </div>

        <button
          type="button"
          onClick={() => pick("#059669")}
          style={{
            height: 28,
            border: "1px solid rgba(0,0,0,.15)",
            borderRadius: 8,
            background: "#fff",
            cursor: "pointer",
            font: "inherit",
          }}
        >
          volver al verde original
        </button>
      </div>
    </div>
  );
}
