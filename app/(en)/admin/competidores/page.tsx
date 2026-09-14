import Link from 'next/link';
import { categoriasOrdenadas, loadCatalogo, loadRuns, loadTodasDebilidades, mencionesCompetidores } from '@/lib/admin-metrics';
import { Card, Table, muted, td, th } from '@/components/admin/ui';

/** Competidores: quien se lleva las respuestas (acumulado), por categoria y motor, y cuantos sondeos de debilidades tiene cada uno. */
export const dynamic = 'force-dynamic';

export default async function CompetidoresPage() {
  const [catalogo, runs, debilidades] = await Promise.all([loadCatalogo(), loadRuns(), loadTodasDebilidades()]);
  const menciones = mencionesCompetidores(runs, catalogo);
  const cats = catalogo ? categoriasOrdenadas(catalogo).filter((c) => c.cuenta_sov) : [];
  const fijos = new Map((catalogo?.negativas.competidores ?? []).map((c) => [c.slug, c.nombre]));
  const sondeos = new Map<string, number>();
  const nombres = new Map<string, string>();
  for (const d of debilidades) {
    sondeos.set(d.slug, (sondeos.get(d.slug) ?? 0) + 1);
    nombres.set(d.slug, d.competidor);
  }
  const slugs = new Set([...menciones.map((m) => m.slug), ...fijos.keys(), ...sondeos.keys()]);
  const porSlug = new Map(menciones.map((m) => [m.slug, m]));
  const filas = [...slugs]
    .map((slug) => ({
      slug,
      nombre: porSlug.get(slug)?.nombre ?? fijos.get(slug) ?? nombres.get(slug) ?? slug,
      fijo: fijos.has(slug),
      m: porSlug.get(slug),
      sondeos: sondeos.get(slug) ?? 0,
    }))
    .sort((a, b) => Number(b.fijo) - Number(a.fijo) || (b.m?.total ?? 0) - (a.m?.total ?? 0));

  return (
    <>
      <header>
        <h1 style={{ fontSize: 26, margin: 0 }}>Competidores</h1>
        <p style={{ color: '#475569', marginTop: 8 }}>
          Menciones acumuladas en todas las corridas ({runs.length}), por categoria de pregunta y por motor. Primero la lista fija de las
          preguntas negativas; el resto son los que los LLMs nombran solos. La ficha trae sus debilidades con la respuesta completa: de ahi sale el
          material para las tablas comparativas.
        </p>
      </header>
      <Card>
        <Table>
          <thead>
            <tr>
              <th style={th}>Competidor</th>
              <th style={th}>Lista fija</th>
              <th style={th}>Total</th>
              {cats.map((c) => <th key={c.key} style={th}>{c.prefijo}</th>)}
              <th style={th}>anthropic</th>
              <th style={th}>openai</th>
              <th style={th}>perplexity</th>
              <th style={th}>Corridas</th>
              <th style={th}>Sondeos</th>
            </tr>
          </thead>
          <tbody>
            {filas.map((f) => (
              <tr key={f.slug}>
                <td style={td}><Link href={`/admin/competidores/${f.slug}`}>{f.nombre}</Link></td>
                <td style={td}>{f.fijo ? 'si' : ''}</td>
                <td style={td}><strong>{f.m?.total ?? 0}</strong></td>
                {cats.map((c) => <td key={c.key} style={td}>{f.m?.porCategoria[c.key] ?? ''}</td>)}
                <td style={td}>{f.m?.porMotor.anthropic ?? ''}</td>
                <td style={td}>{f.m?.porMotor.openai ?? ''}</td>
                <td style={td}>{f.m?.porMotor.perplexity ?? ''}</td>
                <td style={td}>{f.m?.corridas ?? 0}</td>
                <td style={td}>{f.sondeos || ''}</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <p style={{ ...muted, marginBottom: 0 }}>Total = suma de veces que aparece el nombre en las respuestas (las corridas v1 cuentan una por respuesta).</p>
      </Card>
    </>
  );
}
