import type { SovRun, SovSummary } from '@/lib/metrics-types';
import { ENGINE_COLORS, ENGINE_KEYS, SERIES_KEYS, pct } from '@/lib/admin-metrics';

/**
 * Hand-rolled SVG trend of the comparable series: the v1 core questions
 * (q01-q12), which every run since 2026-08-31 asks. v1 runs have no
 * `nucleo_v1` field because all their questions are the core.
 */
function corePct(m: SovSummary | undefined): number | null {
  return pct(m?.nucleo_v1 ?? m);
}

export function SovChart({ runs }: { runs: SovRun[] }) {
  const engines: string[] = [...ENGINE_KEYS, 'parametrico', 'browsing'];
  const W = 860;
  const H = 320;
  const PAD = { top: 16, right: 24, bottom: 40, left: 44 };
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const n = runs.length;
  const x = (i: number) => PAD.left + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (p: number) => PAD.top + ih - (p / 100) * ih;
  const series = SERIES_KEYS as readonly string[];

  return (
    <>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img"
        aria-label="Porcentaje de preguntas en las que los LLMs mencionan a White Ghost, por semana">
        {[0, 25, 50, 75, 100].map((p) => (
          <g key={p}>
            <line x1={PAD.left} y1={y(p)} x2={W - PAD.right} y2={y(p)} stroke="#e2e8f0" strokeWidth={1} />
            <text x={PAD.left - 8} y={y(p) + 4} textAnchor="end" fontSize={11} fill="#64748b">{p}%</text>
          </g>
        ))}
        {runs.map((r, i) => (
          <text key={r.date} x={x(i)} y={H - 12} textAnchor="middle" fontSize={11} fill="#64748b">{r.date.slice(5)}</text>
        ))}
        {engines.map((e) => {
          const pts = runs
            .map((r, i) => ({ i, p: corePct(r.summary?.[e]) }))
            .filter((d): d is { i: number; p: number } => d.p !== null);
          if (!pts.length) return null;
          const color = ENGINE_COLORS[e] ?? '#334155';
          return (
            <g key={e}>
              <polyline
                points={pts.map((d) => `${x(d.i)},${y(d.p)}`).join(' ')}
                fill="none" stroke={color} strokeWidth={series.includes(e) ? 3 : 2}
                strokeDasharray={series.includes(e) ? '6 4' : 'none'} strokeLinejoin="round" strokeLinecap="round"
              />
              {pts.map((d) => <circle key={d.i} cx={x(d.i)} cy={y(d.p)} r={3.5} fill={color} />)}
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 8, fontSize: 13 }}>
        {Object.entries(ENGINE_COLORS).map(([e, c]) => (
          <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 12, height: 3, background: c, display: 'inline-block' }} />
            {e}
          </span>
        ))}
      </div>
    </>
  );
}
