import Link from 'next/link';
import { getBlogPosts, getReleases } from '@/lib/content';
import {
  ENGINE_KEYS, fmt, loadCatalogo, loadRuns, motorOk, pct, resumenPorCategoria,
} from '@/lib/admin-metrics';
import { loadMetricGa4 } from '@/lib/admin-ga4';
import { SovChart } from '@/components/admin/SovChart';
import { Card, Table, muted, td, th } from '@/components/admin/ui';

/**
 * Resumen: are LLMs recommending White Ghost yet? Trend of the comparable
 * core, per-engine table, per-category table (joined with the live catalog),
 * competitor leaderboard, GA4 digest and content counts. Question-level
 * detail lives in /admin/corridas/[date] and /admin/preguntas/[id].
 */
export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const [runs, catalogo, ga4, posts, releases] = await Promise.all([
    loadRuns(),
    loadCatalogo(),
    loadMetricGa4(),
    getBlogPosts().catch(() => []),
    getReleases().catch(() => []),
  ]);
  const latest = runs[runs.length - 1];
  const prev = runs[runs.length - 2];
  const topComp = latest?.competidores_top ?? {};
  const candidatos = latest?.candidatos_marcas ?? [];
  const porCategoria = latest && catalogo ? resumenPorCategoria(latest, catalogo) : [];
  const motoresOk = latest ? ENGINE_KEYS.filter((e) => motorOk(latest, e)) : [];

  return (
    <>
      <header>
        <h1 style={{ fontSize: 28, margin: 0 }}>Visibilidad en LLMs</h1>
        <p style={{ color: '#475569', marginTop: 8 }}>
          Share of voice semanal: porcentaje de las preguntas de referencia en las que cada motor
          menciona a White Ghost. La grafica sigue el nucleo comparable (las 12 preguntas v1); las
          tablas traen el set completo. Parametrico = Anthropic + OpenAI sin browsing; browsing =
          Perplexity con busqueda en vivo. Un motor en amarillo no midio esa semana (error o sin saldo):
          no es un cero.
        </p>
        {!catalogo && (
          <p style={{ background: '#fef9c3', padding: '8px 12px', borderRadius: 8, fontSize: 14 }}>
            No hay catalogo de preguntas en el store. Corre <code>medir_sov.py --sembrar-catalogo</code> una vez.
          </p>
        )}
      </header>

      <Card title="Aparecemos en los LLMs?">
        {runs.length ? (
          <>
            <SovChart runs={runs} />
            {latest && (
              <div style={{ marginTop: 12 }}>
                <Table>
                  <thead>
                    <tr>
                      <th style={th}>Corrida {latest.date} (v{latest.questions_version})</th>
                      <th style={th}>Estado</th>
                      <th style={th}>Total</th>
                      <th style={th}>Nucleo v1</th>
                      <th style={th}>Ponderado</th>
                      <th style={th}>EN</th>
                      <th style={th}>ES</th>
                      <th style={th}>Marca OK</th>
                      <th style={th}>Cita whiteghost.ai</th>
                      <th style={th}>Anterior (nucleo)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...ENGINE_KEYS, 'parametrico', 'browsing'].map((e) => {
                      const s = latest.summary?.[e];
                      if (!s) return null;
                      const p = prev?.summary?.[e];
                      const eng = latest.engines?.[e];
                      const sinMedir = eng && eng.status !== 'ok';
                      return (
                        <tr key={e} style={sinMedir ? { background: '#fefce8' } : undefined}>
                          <td style={td}>{e}</td>
                          <td style={td}>{eng ? (sinMedir ? `sin medir (${eng.status}, ${eng.errors ?? 0} errores)` : (eng.errors ? `ok (${eng.errors} sin medir)` : 'ok')) : 'serie'}</td>
                          <td style={td}>{sinMedir ? '-' : fmt(s)}</td>
                          <td style={td}>{sinMedir ? '-' : fmt(s.nucleo_v1 ?? s)}</td>
                          <td style={td}>{!sinMedir && s.ponderado?.de_puntos ? `${s.ponderado.puntos}/${s.ponderado.de_puntos}` : '-'}</td>
                          <td style={td}>{sinMedir ? '-' : fmt(s.por_lang?.en)}</td>
                          <td style={td}>{sinMedir ? '-' : fmt(s.por_lang?.es)}</td>
                          <td style={td}>{!sinMedir && s.marca?.de ? `${s.marca.correctas}/${s.marca.de}` : '-'}</td>
                          <td style={td}>{sinMedir ? '-' : (s.citan_whiteghost ?? '-')}</td>
                          <td style={td}>{p ? fmt(p.nucleo_v1 ?? p) : 'primera'}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </Table>
                <p style={{ ...muted, marginBottom: 0 }}>
                  Ponderado = suma del potencial (1 a 3) de las preguntas donde nos nombran, sobre la suma del potencial de las medidas.
                  {' '}<Link href={`/admin/corridas/${latest.date}`}>Ver la matriz pregunta x motor de esta corrida</Link>.
                </p>
              </div>
            )}
          </>
        ) : (
          <p style={muted}>Sin mediciones todavia. La rutina semanal sube cada corrida a PUT /api/metrics/sov/AAAA-MM-DD.</p>
        )}
      </Card>

      {latest && catalogo && porCategoria.length > 0 && (
        <Card title={`Por categoria (${latest.date})`} right={<Link href="/admin/preguntas" style={muted}>Ver el catalogo</Link>}>
          <Table>
            <thead>
              <tr>
                <th style={th}>Categoria</th>
                <th style={th}>Preguntas activas</th>
                {motoresOk.map((e) => <th key={e} style={th}>{e}</th>)}
                {motoresOk.map((e) => <th key={`p-${e}`} style={th}>{e} pond.</th>)}
              </tr>
            </thead>
            <tbody>
              {porCategoria.map((f) => (
                <tr key={f.cat.key}>
                  <td style={td}><Link href={`/admin/preguntas?categoria=${f.cat.key}`}>{f.cat.prefijo}</Link> <span style={muted}>{f.cat.nombre}</span></td>
                  <td style={td}>{f.preguntas}</td>
                  {motoresOk.map((e) => {
                    const c = f.porMotor[e];
                    const p = pct(c);
                    return <td key={e} style={td}>{fmt(c)}{p !== null && c?.mencionan ? ` (${p}%)` : ''}</td>;
                  })}
                  {motoresOk.map((e) => {
                    const w = f.ponderado[e];
                    return <td key={`p-${e}`} style={td}>{w ? `${w.puntos}/${w.de_puntos}` : '-'}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
          <p style={{ ...muted, marginBottom: 0 }}>Solo categorias que cuentan en el SoV; marca y negativas se miden aparte.</p>
        </Card>
      )}

      {latest && Object.keys(topComp).length > 0 && (
        <Card title={`Quien se lleva las respuestas (${latest.date})`} right={<Link href="/admin/competidores" style={muted}>Ver competidores y sus debilidades</Link>}>
          <div style={{ display: 'grid', gap: 16, gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))' }}>
            {Object.entries(topComp).map(([e, rows]) => (
              <div key={e}>
                <p style={{ fontSize: 13, color: '#475569', margin: '0 0 6px', textTransform: 'uppercase' }}>{e}</p>
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                  <tbody>
                    {rows.slice(0, 8).map(({ name, count }) => (
                      <tr key={name}>
                        <td style={td}>{name}</td>
                        <td style={{ ...td, textAlign: 'right' }}>{count}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
          </div>
          <p style={{ ...muted, marginBottom: 0 }}>
            Menciones acumuladas por motor en toda la corrida.
            {candidatos.length > 0 && <> Marcas nuevas detectadas (no estan en la lista): {candidatos.slice(0, 8).map((c) => `${c.texto} (${c.veces})`).join(', ')}.</>}
          </p>
        </Card>
      )}

      <div style={{ display: 'grid', gap: 24, gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
        <Card title="Trafico desde LLMs (GA4)">
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
              {ga4.notes && <p style={muted}>{ga4.notes}</p>}
            </>
          ) : (
            <p style={{ ...muted, fontSize: 14 }}>
              Sin resumen todavia. El agente del operador lee GA4 (referrers de chatgpt.com, perplexity.ai,
              claude.ai, gemini.google.com, copilot.microsoft.com) y sube el digest semanal a PUT /api/metrics/ga4-summary/AAAA-Www.
            </p>
          )}
        </Card>

        <Card title="Contenido publicado">
          <p style={{ ...muted, marginTop: 0 }}>Blog: {posts.length} posts. Changelog: {releases.length} entradas.</p>
          <ul style={{ paddingLeft: 18, margin: 0, fontSize: 14 }}>
            {posts.slice(0, 6).map((p) => (
              <li key={p.slug} style={{ marginBottom: 4 }}>
                <a href={`/blog/${p.slug}`}>{p.title}</a> <span style={{ color: '#94a3b8' }}>({p.date})</span>
              </li>
            ))}
          </ul>
        </Card>

        <Card title="Hits a /llms.txt">
          <p style={{ ...muted, fontSize: 14, marginBottom: 0 }}>
            Pendiente: requiere los logs del servicio (user agents GPTBot, ClaudeBot, PerplexityBot no ejecutan JS y no aparecen en GA4).
          </p>
        </Card>
      </div>
    </>
  );
}
