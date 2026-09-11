import Link from 'next/link';
import { categoriasOrdenadas, estadoCelda, loadCatalogo, loadRuns, motoresDeCorrida, ordenCatalogo, resultDe } from '@/lib/admin-metrics';
import { EstadoToggle, NuevaPreguntaForm, PotencialButtons } from '@/components/admin/forms';
import { Card, CeldaBadge, EstadoBadge, LangBadge, Table, muted, td, th } from '@/components/admin/ui';

/**
 * Catalogo de preguntas agrupado por categoria y numerado (DEP-03). Aqui se
 * califica el potencial (1-3), se descarta o reactiva, y se crean preguntas
 * nuevas. La ultima corrida se muestra por motor en cada fila.
 */
export const dynamic = 'force-dynamic';

type Search = { categoria?: string; lang?: string; potencial?: string; estado?: string };

const sel: React.CSSProperties = { border: '1px solid #cbd5e1', borderRadius: 6, padding: '4px 8px', fontSize: 13 };

export default async function PreguntasPage({ searchParams }: { searchParams: Promise<Search> }) {
  const sp = await searchParams;
  const [catalogo, runs] = await Promise.all([loadCatalogo(), loadRuns()]);
  const latest = runs[runs.length - 1];
  const motores = latest ? motoresDeCorrida(latest) : [];

  if (!catalogo) {
    return (
      <Card title="Catalogo de preguntas">
        <p style={muted}>No hay catalogo en el store. Corre <code>medir_sov.py --sembrar-catalogo</code> una vez y recarga.</p>
      </Card>
    );
  }

  const cats = categoriasOrdenadas(catalogo);
  const todas = ordenCatalogo(catalogo);
  const estadoFiltro = sp.estado ?? 'activa';
  const filtradas = todas.filter((p) =>
    (!sp.categoria || p.categoria === sp.categoria)
    && (!sp.lang || p.lang === sp.lang)
    && (!sp.potencial || String(p.potencial) === sp.potencial)
    && (estadoFiltro === 'todas' || p.estado === estadoFiltro),
  );
  const grupos = cats.map((c) => ({ cat: c, items: filtradas.filter((p) => p.categoria === c.key) })).filter((g) => g.items.length);
  const neg = catalogo.negativas;

  return (
    <>
      <header>
        <h1 style={{ fontSize: 26, margin: 0 }}>Catalogo de preguntas (v{catalogo.version})</h1>
        <p style={{ color: '#475569', marginTop: 8 }}>
          {todas.filter((p) => p.estado === 'activa').length} activas de {todas.length}. Potencial: 3 = el caso exacto (no tecnico que hizo
          algo con Claude Code o IA y quiere compartirlo con su equipo con control de acceso, sin git), 2 = adyacente, 1 = hoy no lo
          resolvemos. Descartar saca la pregunta de las corridas futuras sin borrar su historico.
        </p>
      </header>

      <Card>
        <form method="get" style={{ display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center', fontSize: 13 }}>
          <select name="categoria" defaultValue={sp.categoria ?? ''} style={sel}>
            <option value="">todas las categorias</option>
            {cats.map((c) => <option key={c.key} value={c.key}>{c.prefijo}: {c.nombre}</option>)}
          </select>
          <select name="lang" defaultValue={sp.lang ?? ''} style={sel}>
            <option value="">EN y ES</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
          </select>
          <select name="potencial" defaultValue={sp.potencial ?? ''} style={sel}>
            <option value="">todo potencial</option>
            <option value="3">potencial 3</option>
            <option value="2">potencial 2</option>
            <option value="1">potencial 1</option>
          </select>
          <select name="estado" defaultValue={estadoFiltro} style={sel}>
            <option value="activa">activas</option>
            <option value="descartada">descartadas</option>
            <option value="todas">todas</option>
          </select>
          <button style={{ ...sel, cursor: 'pointer', background: '#fff' }}>Filtrar</button>
          <Link href="/admin/preguntas" style={muted}>limpiar</Link>
        </form>
      </Card>

      {grupos.map(({ cat, items }) => (
        <Card key={cat.key} title={`${cat.prefijo}: ${cat.nombre}`} right={<span style={muted}>{items.length} preguntas{cat.cuenta_sov ? '' : ' (no cuentan en el SoV)'}</span>}>
          <Table>
            <thead>
              <tr>
                <th style={th}>Codigo</th>
                <th style={th}>Pregunta</th>
                <th style={th}>Potencial</th>
                <th style={th}>Estado</th>
                {motores.map((e) => <th key={e} style={th}>{e} ({latest?.date.slice(5)})</th>)}
              </tr>
            </thead>
            <tbody>
              {items.map((p) => (
                <tr key={p.id} style={p.estado === 'descartada' ? { opacity: 0.6 } : undefined}>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}>
                    <Link href={`/admin/preguntas/${p.id}`}><strong>{p.codigo}</strong></Link>
                    <div style={{ ...muted, fontSize: 11 }}>{p.id} <LangBadge lang={p.lang} /> {p.persona}</div>
                  </td>
                  <td style={{ ...td, maxWidth: 520 }}>
                    {p.texto}
                    {p.nota && <div style={{ ...muted, marginTop: 4 }}>Nota: {p.nota}</div>}
                  </td>
                  <td style={td}><PotencialButtons p={p} /></td>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}><EstadoBadge estado={p.estado} /> <EstadoToggle p={p} /></td>
                  {motores.map((e) => {
                    if (!latest) return <td key={e} style={td}>-</td>;
                    const r = resultDe(latest, e, p.id);
                    const estado = estadoCelda(latest, e, p.id);
                    const top = (r?.competitors_ordered ?? []).slice(0, 3).join(', ');
                    const extra = estado === 'nombra' ? `#${r?.self_rank ?? '?'}` : estado === 'no' ? top || 'nadie' : undefined;
                    return <td key={e} style={td}><CeldaBadge estado={estado} extra={extra} /></td>;
                  })}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      ))}

      {(!sp.categoria || sp.categoria === 'negativa') && (
        <Card title="NEG: preguntas negativas (debilidades de competidores)" right={<span style={muted}>{neg.competidores.length} competidores x {neg.plantillas.length} plantillas, cada semana</span>}>
          <p style={{ ...muted, marginTop: 0 }}>
            A cada competidor de la lista fija se le hacen estas plantillas en cada motor, mas el top 3 de menciones de la semana. Las respuestas
            completas estan en la ficha de cada competidor. La lista y las plantillas se editan hoy en el snapshot con el medidor (no desde aqui).
          </p>
          <Table>
            <thead>
              <tr>
                <th style={th}>Competidor</th>
                {neg.plantillas.map((t) => <th key={t.id} style={th}>{t.id} ({t.lang})</th>)}
              </tr>
            </thead>
            <tbody>
              {neg.competidores.map((c, i) => (
                <tr key={c.slug}>
                  <td style={{ ...td, whiteSpace: 'nowrap' }}><Link href={`/admin/competidores/${c.slug}`}>NEG-{String(i + 1).padStart(2, '0')} {c.nombre}</Link></td>
                  {neg.plantillas.map((t) => <td key={t.id} style={{ ...td, ...muted }}>{t.texto.replace('{competidor}', c.nombre)}</td>)}
                </tr>
              ))}
            </tbody>
          </Table>
        </Card>
      )}

      <Card title="Nueva pregunta">
        <p style={{ ...muted, marginTop: 0 }}>
          Se crea activa con el siguiente id libre y el siguiente numero de su categoria; entra en la corrida del proximo lunes. Sube la version del catalogo.
        </p>
        <NuevaPreguntaForm categorias={cats} />
      </Card>
    </>
  );
}
