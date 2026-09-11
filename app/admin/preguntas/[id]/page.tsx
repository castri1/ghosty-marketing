import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ENGINE_KEYS, estadoCelda, loadCatalogo, loadRespuestas, loadRuns, preguntaDe, resultDe } from '@/lib/admin-metrics';
import { EstadoToggle, NotaForm, PotencialButtons } from '@/components/admin/forms';
import { CitasList, Competidores, RespuestaCompleta } from '@/components/admin/respuestas';
import { Card, CeldaBadge, Crumbs, EstadoBadge, LangBadge, PotencialBadge, muted } from '@/components/admin/ui';

/** Ficha de una pregunta: metadatos editables e historial de respuestas completas por corrida y motor. */
export const dynamic = 'force-dynamic';

export default async function PreguntaPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!/^q\d{2,}$/.test(id)) notFound();
  const [catalogo, runs, respuestas] = await Promise.all([loadCatalogo(), loadRuns(), loadRespuestas(id)]);
  const p = preguntaDe(catalogo, id);
  const corridas = [...runs].reverse().filter((r) => ENGINE_KEYS.some((e) => resultDe(r, e, id)));
  if (!p && !corridas.length) notFound();
  const porFecha = new Map(respuestas.map((r) => [r.date, r]));

  return (
    <>
      <header>
        <Crumbs items={[['/admin/preguntas', 'Preguntas'], p ? `${p.cat.prefijo}: ${p.cat.nombre}` : 'sin catalogo', p?.codigo ?? id]} />
        <h1 style={{ fontSize: 24, margin: 0 }}>
          {p?.codigo ?? id} <span style={{ ...muted, fontSize: 14 }}>{id}</span>
        </h1>
        <p style={{ fontSize: 18, margin: '8px 0', lineHeight: 1.4 }}>{p?.texto ?? <span style={muted}>(la pregunta ya no esta en el catalogo)</span>}</p>
        {p && (
          <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap', fontSize: 14 }}>
            <LangBadge lang={p.lang} /> <span style={muted}>{p.persona}</span>
            <PotencialBadge n={p.potencial} /> <PotencialButtons p={p} />
            <EstadoBadge estado={p.estado} /> <EstadoToggle p={p} />
            <span style={muted}>desde v{p.desde_version}, creada {p.creada}</span>
          </div>
        )}
      </header>

      {p && (
        <Card title="Nota">
          <NotaForm p={p} />
        </Card>
      )}

      {corridas.length === 0 && <Card><p style={muted}>Todavia no se ha corrido esta pregunta.</p></Card>}

      {corridas.map((run) => {
        const doc = porFecha.get(run.date);
        return (
          <Card key={run.date} title={`Corrida ${run.date}`} right={<Link href={`/admin/corridas/${run.date}`} style={muted}>matriz completa</Link>}>
            <div style={{ display: 'grid', gap: 16 }}>
              {ENGINE_KEYS.map((e) => {
                if (!run.engines?.[e]) return null;
                const r = resultDe(run, e, id);
                const estado = estadoCelda(run, e, id);
                const full = doc?.engines?.[e];
                return (
                  <div key={e} style={{ borderLeft: '3px solid #e2e8f0', paddingLeft: 12 }}>
                    <p style={{ margin: '0 0 6px', fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569' }}>
                      {e} <span style={{ ...muted, textTransform: 'none' }}>{run.engines?.[e]?.model}</span>{' '}
                      <CeldaBadge estado={estado} extra={estado === 'nombra' ? `posicion ${r?.self_rank ?? '?'}` : undefined} />
                    </p>
                    {estado === 'sin-medir' || estado === 'sin-pregunta' ? (
                      <p style={{ ...muted, margin: 0 }}>{r?.error ?? `motor en estado ${run.engines?.[e]?.status}`}</p>
                    ) : (
                      <>
                        <RespuestaCompleta texto={full?.answer_full} resumen={r?.answer_excerpt} />
                        {!full?.answer_full && r?.answer_excerpt && (
                          <p style={{ ...muted, margin: '4px 0 0' }}>Corrida sin respuesta completa en el store (v1 o no resubida): solo el extracto.</p>
                        )}
                        {r && <Competidores m={{ competitors: r.competitors, self_rank: r.self_rank, mentioned: r.mentioned }} />}
                        {r?.marca_ok !== null && r?.marca_ok !== undefined && (
                          <p style={{ ...muted, margin: '4px 0 0' }}>Marca: {r.marca_ok ? 'nos describe bien como plataforma de deploy' : 'NO sabe que somos (riesgo de marca)'}</p>
                        )}
                        <CitasList citas={full?.citations ?? r?.citations} />
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        );
      })}
    </>
  );
}
