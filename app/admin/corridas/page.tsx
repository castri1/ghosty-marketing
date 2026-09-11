import Link from 'next/link';
import { ENGINE_KEYS, fmt, loadRuns } from '@/lib/admin-metrics';
import { Card, Table, muted, td, th } from '@/components/admin/ui';

/** Lista de corridas con el estado de cada motor. */
export const dynamic = 'force-dynamic';

export default async function CorridasPage() {
  const runs = (await loadRuns()).reverse();
  return (
    <>
      <header>
        <h1 style={{ fontSize: 26, margin: 0 }}>Corridas</h1>
        <p style={{ color: '#475569', marginTop: 8 }}>Una fila por corrida del medidor. Cada motor: menciones sobre preguntas medidas, o el motivo por el que no midio.</p>
      </header>
      <Card>
        <Table>
          <thead>
            <tr>
              <th style={th}>Fecha</th>
              <th style={th}>Preguntas v</th>
              {ENGINE_KEYS.map((e) => <th key={e} style={th}>{e}</th>)}
              <th style={th}>parametrico</th>
              <th style={th}>browsing</th>
            </tr>
          </thead>
          <tbody>
            {runs.map((r) => (
              <tr key={r.date}>
                <td style={td}><Link href={`/admin/corridas/${r.date}`}>{r.date}</Link></td>
                <td style={td}>v{r.questions_version}{r.catalogo_version ? ` (catalogo v${r.catalogo_version})` : ''}</td>
                {ENGINE_KEYS.map((e) => {
                  const eng = r.engines?.[e];
                  if (!eng) return <td key={e} style={{ ...td, ...muted }}>-</td>;
                  if (eng.status !== 'ok') return <td key={e} style={{ ...td, background: '#fefce8' }}>sin medir ({eng.status}{eng.errors ? `, ${eng.errors} err` : ''})</td>;
                  return <td key={e} style={td}>{fmt(r.summary?.[e])}{eng.errors ? <span style={muted}> ({eng.errors} err)</span> : null}</td>;
                })}
                <td style={td}>{fmt(r.summary?.parametrico)}</td>
                <td style={td}>{fmt(r.summary?.browsing)}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        {!runs.length && <p style={muted}>Sin corridas.</p>}
      </Card>
    </>
  );
}
