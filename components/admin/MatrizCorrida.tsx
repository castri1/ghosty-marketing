import { Fragment } from 'react';
import Link from 'next/link';
import type { SovCatalogo, SovRun } from '@/lib/metrics-types';
import { estadoCelda, idsDeCorrida, motorOk, motoresDeCorrida, preguntaDe, resultDe } from '@/lib/admin-metrics';
import { CeldaBadge, LangBadge, PotencialBadge, Table, muted, td, th } from '@/components/admin/ui';

/** Question x engine matrix for one run; rows come from the union of all engines' ids. */
export function MatrizCorrida({ run, catalogo, compacta = false }: { run: SovRun; catalogo: SovCatalogo | null; compacta?: boolean }) {
  const motores = motoresDeCorrida(run);
  const ids = idsDeCorrida(run, catalogo);
  let catActual = '';
  return (
    <Table>
      <thead>
        <tr>
          <th style={th}>Codigo</th>
          <th style={th}>Pregunta</th>
          {motores.map((e) => (
            <th key={e} style={th}>
              {e}
              {!motorOk(run, e) && <span style={{ ...muted, textTransform: 'none', marginLeft: 6 }}>({run.engines?.[e]?.status})</span>}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ids.map((id) => {
          const p = preguntaDe(catalogo, id);
          const catKey = p?.cat.nombre ?? 'sin categoria';
          const header = catKey !== catActual;
          catActual = catKey;
          return (
            <Fragment key={id}>
              {header && (
                <tr>
                  <td colSpan={2 + motores.length} style={{ ...td, background: '#f8fafc', fontSize: 12, textTransform: 'uppercase', letterSpacing: '0.04em', color: '#475569' }}>
                    {catKey}
                  </td>
                </tr>
              )}
              <tr>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>
                  <Link href={`/admin/preguntas/${id}`}>{p?.codigo ?? id}</Link>
                  {p && <> <PotencialBadge n={p.potencial} /> <LangBadge lang={p.lang} /></>}
                </td>
                <td style={{ ...td, maxWidth: compacta ? 320 : 480 }}>{p?.texto ?? <span style={muted}>(no esta en el catalogo)</span>}</td>
                {motores.map((e) => {
                  const r = resultDe(run, e, id);
                  const estado = estadoCelda(run, e, id);
                  const top = (r?.competitors_ordered ?? []).slice(0, 3).join(', ');
                  const extra = estado === 'nombra' ? `#${r?.self_rank ?? '?'}` : estado === 'no' ? top || 'nadie' : undefined;
                  return (
                    <td key={e} style={td}>
                      <CeldaBadge estado={estado} extra={extra} />
                    </td>
                  );
                })}
              </tr>
            </Fragment>
          );
        })}
      </tbody>
    </Table>
  );
}
