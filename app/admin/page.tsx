import type { Metadata } from 'next';
import { getDb } from '@/lib/firestore';
import { METRICS_COLLECTION, type Ga4Summary, type SovRun } from '@/lib/metrics-types';
import { getBlogPosts, getReleases } from '@/lib/content';

/**
 * Operator dashboard (Basic Auth via middleware.ts; noindex). Headline
 * question: are LLMs recommending White Ghost yet? Data comes from the
 * `marketing_metrics` collection, fed by the weekly local SoV run and the
 * operator's GA4 digests. Always dynamic — no cached admin data, and the
 * credential-less build never prerenders it.
 */

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Admin - White Ghost',
  robots: { index: false, follow: false },
};

const ENGINE_COLORS: Record<string, string> = {
  anthropic: '#d97757',
  openai: '#10a37f',
  perplexity: '#1f7a8c',
  agregado: '#0f172a',
};

async function loadMetric<T>(kind: string): Promise<T[]> {
  try {
    const snap = await getDb().collection(METRICS_COLLECTION).where('kind', '==', kind).get();
    return snap.docs.map((d) => d.data() as T);
  } catch (err) {
    console.warn(`[admin] metrics read unavailable (${err instanceof Error ? err.message : String(err)})`);
    return [];
  }
}

function pct(m: { mencionan: number; de: number } | undefined): number | null {
  if (!m || !m.de) return null;
  return Math.round((m.mencionan / m.de) * 100);
}

function SovChart({ runs }: { runs: SovRun[] }) {
  const engines = ['anthropic', 'openai', 'perplexity', 'agregado'];
  const W = 860;
  const H = 320;
  const PAD = { top: 16, right: 24, bottom: 40, left: 44 };
  const iw = W - PAD.left - PAD.right;
  const ih = H - PAD.top - PAD.bottom;
  const n = runs.length;
  const x = (i: number) => PAD.left + (n === 1 ? iw / 2 : (i / (n - 1)) * iw);
  const y = (p: number) => PAD.top + ih - (p / 100) * ih;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height: 'auto', display: 'block' }} role="img"
      aria-label="Porcentaje de preguntas en las que los LLMs mencionan a White Ghost, por semana">
      {[0, 25, 50, 75, 100].map((p) => (
        <g key={p}>
          <line x1={PAD.left} y1={y(p)} x2={W - PAD.right} y2={y(p)} stroke="#e2e8f0" strokeWidth={1} />
          <text x={PAD.left - 8} y={y(p) + 4} textAnchor="end" fontSize={11} fill="#64748b">{p}%</text>
        </g>
      ))}
      {runs.map((r, i) => (
        <text key={r.date} x={x(i)} y={H - 12} textAnchor="middle" fontSize={11} fill="#64748b">
          {r.date.slice(5)}
        </text>
      ))}
      {engines.map((e) => {
        const pts = runs
          .map((r, i) => ({ i, p: pct(r.summary?.[e]) }))
          .filter((d): d is { i: number; p: number } => d.p !== null);
        if (!pts.length) return null;
        const color = ENGINE_COLORS[e] ?? '#334155';
        return (
          <g key={e}>
            <polyline
              points={pts.map((d) => `${x(d.i)},${y(d.p)}`).join(' ')}
              fill="none" stroke={color} strokeWidth={e === 'agregado' ? 3 : 2}
              strokeDasharray={e === 'agregado' ? undefined : 'none'} strokeLinejoin="round" strokeLinecap="round"
            />
            {pts.map((d) => (
              <circle key={d.i} cx={x(d.i)} cy={y(d.p)} r={3.5} fill={color} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

const card: React.CSSProperties = {
  border: '1px solid #e2e8f0',
  borderRadius: 12,
  padding: '20px 24px',
  background: '#fff',
};

const th: React.CSSProperties = {
  textAlign: 'left', padding: '6px 10px', borderBottom: '1px solid #cbd5e1',
  fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569',
};
const td: React.CSSProperties = { padding: '6px 10px', borderBottom: '1px solid #f1f5f9', fontSize: 14 };

export default async function AdminPage() {
  const [sovRaw, ga4Raw, posts, releases] = await Promise.all([
    loadMetric<SovRun>('sov'),
    loadMetric<Ga4Summary>('ga4-summary'),
    getBlogPosts().catch(() => []),
    getReleases().catch(() => []),
  ]);

  const runs = sovRaw
    .filter((r) => r?.date)
    .sort((a, b) => a.date.localeCompare(b.date));
  const latest = runs[runs.length - 1];
  const prev = runs[runs.length - 2];
  const ga4 = ga4Raw.filter((g) => g?.week).sort((a, b) => b.week.localeCompare(a.week))[0];

  const engineRows = latest
    ? Object.entries(latest.summary ?? {}).filter(([k]) => k !== 'agregado')
    : [];

  return (
    <main style={{ maxWidth: 960, margin: '0 auto', padding: '48px 20px', display: 'grid', gap: 24 }}>
      <header>
        <h1 style={{ fontSize: 28, margin: 0 }}>Admin: visibilidad en LLMs</h1>
        <p style={{ color: '#475569', marginTop: 8 }}>
          Share of voice semanal: porcentaje de las preguntas de referencia en las que cada motor
          menciona a White Ghost. Lo alimenta la rutina semanal (medidor por API, llamadas limpias).
        </p>
      </header>

      <section style={card}>
        <h2 style={{ fontSize: 18, marginTop: 0 }}>Aparecemos en los LLMs?</h2>
        {runs.length ? (
          <>
            <SovChart runs={runs} />
            <div style={{ display: 'flex', gap: 18, flexWrap: 'wrap', marginTop: 8, fontSize: 13 }}>
              {Object.entries(ENGINE_COLORS).map(([e, c]) => (
                <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 3, background: c, display: 'inline-block' }} />
                  {e}
                </span>
              ))}
            </div>
            {latest && (
              <p style={{ marginBottom: 0, fontSize: 14, color: '#334155' }}>
                Ultima corrida {latest.date}: agregado {latest.summary?.agregado?.mencionan ?? 0}/
                {latest.summary?.agregado?.de ?? 0}
                {prev && prev.summary?.agregado
                  ? ` (anterior ${prev.summary.agregado.mencionan}/${prev.summary.agregado.de})`
                  : ' (primera medicion)'}
              </p>
            )}
          </>
        ) : (
          <p style={{ color: '#64748b' }}>
            Sin mediciones todavia. La rutina semanal sube cada corrida a
            PUT /api/metrics/sov/AAAA-MM-DD.
          </p>
        )}
      </section>

      {latest && (
        <section style={card}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Ultima corrida en detalle ({latest.date})</h2>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ borderCollapse: 'collapse', width: '100%' }}>
              <thead>
                <tr>
                  <th style={th}>Pregunta</th>
                  {engineRows.map(([e]) => (
                    <th key={e} style={th}>{e}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(latest.engines?.[engineRows[0]?.[0] ?? '']?.results ?? []).map((row) => (
                  <tr key={row.id}>
                    <td style={td}>{row.id}</td>
                    {engineRows.map(([e]) => {
                      const r = latest.engines?.[e]?.results?.find((x) => x.id === row.id);
                      return (
                        <td key={e} style={td}>
                          {r?.error
                            ? 'error'
                            : r?.mentioned
                              ? 'NOS NOMBRA'
                              : (r?.competitors_ordered ?? []).slice(0, 3).join(', ') || '-'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p style={{ fontSize: 13, color: '#64748b', marginBottom: 0 }}>
            En cada celda: NOS NOMBRA, o el top 3 de competidores que el motor nombro.
          </p>
        </section>
      )}

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <section style={card}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Trafico desde LLMs (GA4)</h2>
          {ga4 ? (
            <>
              <p style={{ fontSize: 14, color: '#334155' }}>Semana {ga4.week}</p>
              <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                <tbody>
                  {ga4.llm_referrers.map((r) => (
                    <tr key={r.source}>
                      <td style={td}>{r.source}</td>
                      <td style={{ ...td, textAlign: 'right' }}>{r.sessions}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {ga4.notes && <p style={{ fontSize: 13, color: '#64748b' }}>{ga4.notes}</p>}
            </>
          ) : (
            <p style={{ color: '#64748b', fontSize: 14 }}>
              Sin resumen todavia. El agente del operador lee GA4 (referrers de chatgpt.com,
              perplexity.ai, claude.ai, gemini.google.com, copilot.microsoft.com) y sube el
              digest semanal a PUT /api/metrics/ga4-summary/AAAA-Www.
            </p>
          )}
        </section>

        <section style={card}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Contenido publicado</h2>
          <p style={{ fontSize: 13, color: '#64748b', marginTop: 0 }}>
            Blog: {posts.length} posts. Changelog: {releases.length} entradas.
          </p>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14 }}>
            {posts.slice(0, 6).map((p) => (
              <li key={p.slug} style={{ marginBottom: 4 }}>
                <a href={`/blog/${p.slug}`}>{p.title}</a>{' '}
                <span style={{ color: '#94a3b8' }}>({p.date})</span>
              </li>
            ))}
          </ul>
        </section>

        <section style={card}>
          <h2 style={{ fontSize: 18, marginTop: 0 }}>Hits a /llms.txt</h2>
          <p style={{ color: '#64748b', fontSize: 14, marginBottom: 0 }}>
            Pendiente: requiere los logs del servicio (user agents GPTBot, ClaudeBot,
            PerplexityBot no ejecutan JS y no aparecen en GA4).
          </p>
        </section>
      </div>
    </main>
  );
}
