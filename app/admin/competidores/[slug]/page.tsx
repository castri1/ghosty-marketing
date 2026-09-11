import { notFound } from 'next/navigation';
import { categoriasOrdenadas, loadCatalogo, loadDebilidades, loadRuns, mencionesCompetidores } from '@/lib/admin-metrics';
import { CitasList, RespuestaCompleta } from '@/components/admin/respuestas';
import { Card, Crumbs, Table, muted, td, th } from '@/components/admin/ui';

/** Ficha de un competidor: menciones por categoria y motor, y sus debilidades (respuesta completa) por corrida, motor y plantilla. */
export const dynamic = 'force-dynamic';

export default async function CompetidorPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!/^[a-z0-9-]+$/.test(slug)) notFound();
  const [catalogo, runs, debilidades] = await Promise.all([loadCatalogo(), loadRuns(), loadDebilidades(slug)]);
  const m = mencionesCompetidores(runs, catalogo).find((x) => x.slug === slug);
  const fijo = catalogo?.negativas.competidores.find((c) => c.slug === slug);
  if (!m && !fijo && !debilidades.length) notFound();
  const nombre = m?.nombre ?? fijo?.nombre ?? debilidades[0]?.competidor ?? slug;
  const cats = catalogo ? categoriasOrdenadas(catalogo).filter((c) => c.cuenta_sov) : [];
  const plantillas = new Map((catalogo?.negativas.plantillas ?? []).map((t) => [t.id, t]));

  return (
    <>
      <header>
        <Crumbs items={[['/admin/competidores', 'Competidores'], nombre]} />
        <h1 style={{ fontSize: 26, margin: 0 }}>{nombre}</h1>
        <p style={{ color: '#475569', marginTop: 8 }}>
          {fijo ? 'En la lista fija de preguntas negativas.' : 'Lo nombran los LLMs; no esta en la lista fija.'}{' '}
          {m ? `${m.total} menciones acumuladas en ${m.corridas} corridas.` : 'Sin menciones en las corridas guardadas.'}
        </p>
      </header>

      {m && (
        <Card title="Donde lo nombran">
          <Table>
            <thead>
              <tr>
                {cats.map((c) => <th key={c.key} style={th}>{c.prefijo}</th>)}
                <th style={th}>anthropic</th>
                <th style={th}>openai</th>
                <th style={th}>perplexity</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                {cats.map((c) => <td key={c.key} style={td}>{m.porCategoria[c.key] ?? 0}</td>)}
                <td style={td}>{m.porMotor.anthropic ?? 0}</td>
                <td style={td}>{m.porMotor.openai ?? 0}</td>
                <td style={td}>{m.porMotor.perplexity ?? 0}</td>
              </tr>
            </tbody>
          </Table>
        </Card>
      )}

      {debilidades.length === 0 && (
        <Card title="Debilidades segun los LLMs"><p style={muted}>Sin sondeos guardados todavia para este competidor.</p></Card>
      )}

      {debilidades.map((d) => (
        <Card key={d.date} title={`Debilidades segun los LLMs, corrida ${d.date}`} right={<span style={muted}>origen: {d.origen}</span>}>
          <div style={{ display: 'grid', gap: 16 }}>
            {Object.entries(d.engines).map(([engine, items]) => (
              <div key={engine} style={{ borderLeft: '3px solid #e2e8f0', paddingLeft: 12 }}>
                <p style={{ margin: '0 0 8px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569' }}>{engine}</p>
                <div style={{ display: 'grid', gap: 12 }}>
                  {items.map((it) => (
                    <div key={it.plantilla}>
                      <p style={{ margin: '0 0 4px', fontSize: 14 }}>
                        <strong>{it.plantilla}</strong> <span style={muted}>({it.lang ?? plantillas.get(it.plantilla)?.lang ?? '?'})</span> {it.pregunta}
                      </p>
                      {it.error ? (
                        <p style={{ ...muted, margin: 0 }}>error: {it.error}</p>
                      ) : (
                        <>
                          {it.bullets && it.bullets.length > 0 && (
                            <ul style={{ margin: '0 0 6px', paddingLeft: 18, fontSize: 14 }}>
                              {it.bullets.map((b, i) => <li key={i}>{b}</li>)}
                            </ul>
                          )}
                          <RespuestaCompleta texto={it.respuesta} resumen="Ver respuesta completa" />
                          {it.menciona_whiteghost && <p style={{ ...muted, margin: '4px 0 0', color: '#166534' }}>Menciona a White Ghost.</p>}
                          <CitasList citas={it.citations} />
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ))}
    </>
  );
}
