import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ENGINE_KEYS, fmt, loadCatalogo, loadDebilidadesDeCorrida, loadRun } from '@/lib/admin-metrics';
import { MatrizCorrida } from '@/components/admin/MatrizCorrida';
import { Card, Crumbs, muted } from '@/components/admin/ui';

/** Una corrida: matriz pregunta x motor (union de ids, ordenada por el catalogo) y los competidores sondeados esa semana. */
export const dynamic = 'force-dynamic';

export default async function CorridaPage({ params }: { params: Promise<{ date: string }> }) {
  const { date } = await params;
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();
  const [run, catalogo, debilidades] = await Promise.all([loadRun(date), loadCatalogo(), loadDebilidadesDeCorrida(date)]);
  if (!run) notFound();
  const motores = ENGINE_KEYS.filter((e) => run.engines?.[e]);

  return (
    <>
      <header>
        <Crumbs items={[['/admin/corridas', 'Corridas'], date]} />
        <h1 style={{ fontSize: 26, margin: 0 }}>Corrida {date}</h1>
        <p style={{ color: '#475569', marginTop: 8 }}>
          {motores.map((e) => {
            const eng = run.engines?.[e];
            return <span key={e} style={{ marginRight: 14 }}><strong>{e}</strong>: {eng?.status === 'ok' ? fmt(run.summary?.[e]) : `sin medir (${eng?.status})`}</span>;
          })}
        </p>
      </header>
      <Card title="Pregunta x motor">
        <MatrizCorrida run={run} catalogo={catalogo} />
        <p style={{ ...muted, marginBottom: 0 }}>
          NOS NOMBRA con la posicion en que aparecemos; si no, el top 3 de competidores que nombro el motor. Amarillo = ese motor no midio la pregunta.
          Clic en el codigo para ver las respuestas completas.
        </p>
      </Card>
      {debilidades.length > 0 && (
        <Card title="Competidores sondeados esta semana">
          <p style={{ margin: 0, fontSize: 14 }}>
            {[...debilidades]
              .sort((a, b) => a.origen.localeCompare(b.origen) || a.competidor.localeCompare(b.competidor))
              .map((d, i) => (
                <span key={d.slug}>
                  {i > 0 && ', '}
                  <Link href={`/admin/competidores/${d.slug}`}>{d.competidor}</Link>
                  <span style={muted}> ({d.origen})</span>
                </span>
              ))}
          </p>
        </Card>
      )}
    </>
  );
}
