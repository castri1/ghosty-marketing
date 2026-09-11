import type { CatalogoCategoria, CatalogoPregunta } from '@/lib/metrics-types';
import { crearPregunta, setEstado, setNota, setPotencial } from '@/lib/admin-actions';
import { muted } from '@/components/admin/ui';

/** Progressive-enhancement forms: plain <form action={serverAction}>, no client JS. */

const btn: React.CSSProperties = {
  border: '1px solid #cbd5e1', background: '#fff', borderRadius: 6, padding: '2px 8px', fontSize: 12, cursor: 'pointer',
};
const btnOn: React.CSSProperties = { ...btn, background: '#0f172a', color: '#fff', border: '1px solid #0f172a' };
const input: React.CSSProperties = { border: '1px solid #cbd5e1', borderRadius: 6, padding: '6px 8px', fontSize: 14, width: '100%' };

export function PotencialButtons({ p }: { p: CatalogoPregunta }) {
  const action = setPotencial.bind(null, p.id);
  return (
    <form action={action} style={{ display: 'inline-flex', gap: 4 }}>
      {[1, 2, 3].map((n) => (
        <button key={n} name="potencial" value={n} style={p.potencial === n ? btnOn : btn} title={`potencial ${n}`}>
          {n}
        </button>
      ))}
    </form>
  );
}

export function EstadoToggle({ p }: { p: CatalogoPregunta }) {
  const action = setEstado.bind(null, p.id);
  const next = p.estado === 'activa' ? 'descartada' : 'activa';
  return (
    <form action={action} style={{ display: 'inline' }}>
      <button name="estado" value={next} style={btn}>{next === 'descartada' ? 'descartar' : 'reactivar'}</button>
    </form>
  );
}

export function NotaForm({ p }: { p: CatalogoPregunta }) {
  const action = setNota.bind(null, p.id);
  return (
    <form action={action} style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
      <textarea name="nota" defaultValue={p.nota} rows={2} maxLength={500} placeholder="Nota (por que tiene o no sentido, que esperamos)" style={{ ...input, resize: 'vertical' }} />
      <button style={btn}>Guardar</button>
    </form>
  );
}

export function NuevaPreguntaForm({ categorias }: { categorias: CatalogoCategoria[] }) {
  return (
    <form action={crearPregunta} style={{ display: 'grid', gap: 10, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', alignItems: 'end' }}>
      <label style={muted}>
        Categoria
        <select name="categoria" required style={input} defaultValue="">
          <option value="" disabled>elige</option>
          {categorias.filter((c) => c.key !== 'negativa').map((c) => (
            <option key={c.key} value={c.key}>{c.prefijo}: {c.nombre}</option>
          ))}
        </select>
      </label>
      <label style={muted}>
        Idioma
        <select name="lang" style={input} defaultValue="en">
          <option value="en">EN</option>
          <option value="es">ES</option>
        </select>
      </label>
      <label style={muted}>
        Persona
        <select name="persona" style={input} defaultValue="no-tecnico">
          <option value="no-tecnico">no tecnico</option>
          <option value="ceo">CEO</option>
          <option value="tecnico">tecnico</option>
        </select>
      </label>
      <label style={muted}>
        Potencial
        <select name="potencial" style={input} defaultValue="3">
          <option value="3">3 (caso exacto)</option>
          <option value="2">2 (adyacente)</option>
          <option value="1">1 (no lo resolvemos hoy)</option>
        </select>
      </label>
      <label style={{ ...muted, gridColumn: '1 / -1' }}>
        Pregunta, tal cual la escribiria la persona (sin prompt de sistema, esto es lo unico que ve el LLM)
        <textarea name="texto" required minLength={8} rows={2} style={{ ...input, resize: 'vertical' }} />
      </label>
      <label style={{ ...muted, gridColumn: '1 / span 2' }}>
        Nota (opcional)
        <input name="nota" maxLength={500} style={input} />
      </label>
      <button style={{ ...btn, padding: '6px 14px', fontSize: 14 }}>Crear pregunta</button>
    </form>
  );
}
