import Link from 'next/link';
import type { SovRespuestaMotor } from '@/lib/metrics-types';
import { slugify } from '@/lib/metrics-types';
import { mono, muted } from '@/components/admin/ui';

/** Full LLM answer, collapsed by default; the excerpt stays visible. */
export function RespuestaCompleta({ texto, resumen, abierto = false }: { texto?: string; resumen?: string; abierto?: boolean }) {
  if (!texto) {
    return <p style={{ ...muted, margin: 0, whiteSpace: 'pre-wrap' }}>{resumen ?? 'sin respuesta guardada'}</p>;
  }
  return (
    <details open={abierto}>
      <summary style={{ cursor: 'pointer', fontSize: 14, color: '#334155' }}>
        {resumen ? `${resumen.slice(0, 220)}${resumen.length > 220 ? '...' : ''}` : 'Ver respuesta completa'}
        <span style={{ ...muted, marginLeft: 6 }}>({texto.length} caracteres)</span>
      </summary>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: 14, lineHeight: 1.5, background: '#f8fafc', padding: 12, borderRadius: 8, margin: '8px 0 0' }}>
        {texto}
      </pre>
    </details>
  );
}

export function CitasList({ citas }: { citas?: string[] }) {
  if (!citas?.length) return null;
  return (
    <ul style={{ margin: '6px 0 0', paddingLeft: 18, ...mono }}>
      {citas.map((c, i) => (
        <li key={`${i}-${c}`} style={{ wordBreak: 'break-all' }}>
          <a href={c} target="_blank" rel="noopener noreferrer" style={{ color: '#475569' }}>{c}</a>
        </li>
      ))}
    </ul>
  );
}

export function Competidores({ m }: { m: Pick<SovRespuestaMotor, 'competitors' | 'self_rank' | 'mentioned'> }) {
  const comps = m.competitors ?? [];
  return (
    <p style={{ ...muted, margin: '6px 0 0' }}>
      {m.mentioned ? <strong style={{ color: '#166534' }}>Nos nombra (posicion {m.self_rank ?? '?'}). </strong> : null}
      {comps.length
        ? comps.map((c, i) => (
            <span key={c.name}>
              {i > 0 && ', '}
              <Link href={`/admin/competidores/${slugify(c.name)}`} style={{ color: '#475569' }}>{c.name}</Link>
              <span> ({c.count}x, #{c.rank})</span>
            </span>
          ))
        : 'ningun competidor de la lista'}
    </p>
  );
}
