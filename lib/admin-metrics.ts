import { getDb } from '@/lib/firestore';
import {
  METRICS_COLLECTION,
  codigoDe,
  slugify,
  type CatalogoCategoria,
  type CatalogoPregunta,
  type SovCatalogo,
  type SovDebilidades,
  type SovRespuestas,
  type SovRun,
} from '@/lib/metrics-types';

/**
 * Read helpers for the operator dashboard (/admin). Every reader swallows
 * store errors and returns an empty value: the credential-less build must
 * never fail because Firestore is unreachable, and a missing catalog is a
 * normal state before `medir_sov.py --sembrar-catalogo` has run.
 *
 * Queries are equality-only on `kind` plus one field (`qid`, `date`, `slug`),
 * which Firestore serves without a composite index.
 */

export const ENGINE_KEYS = ['anthropic', 'openai', 'perplexity'] as const;
export const SERIES_KEYS = ['parametrico', 'browsing', 'agregado'] as const;
export const ENGINE_COLORS: Record<string, string> = {
  anthropic: '#d97757',
  openai: '#10a37f',
  perplexity: '#1f7a8c',
  parametrico: '#0f172a',
  browsing: '#7c3aed',
};

async function query<T>(kind: string, field?: string, value?: string): Promise<T[]> {
  try {
    let q = getDb().collection(METRICS_COLLECTION).where('kind', '==', kind);
    if (field && value !== undefined) q = q.where(field, '==', value);
    const snap = await q.get();
    return snap.docs.map((d) => d.data() as T);
  } catch (err) {
    console.warn(`[admin] metrics read unavailable (${err instanceof Error ? err.message : String(err)})`);
    return [];
  }
}

export async function loadRuns(): Promise<SovRun[]> {
  const runs = await query<SovRun>('sov');
  return runs.filter((r) => r?.date).sort((a, b) => a.date.localeCompare(b.date));
}

export async function loadRun(date: string): Promise<SovRun | null> {
  const rows = await query<SovRun>('sov', 'date', date);
  return rows[0] ?? null;
}

export async function loadCatalogo(): Promise<SovCatalogo | null> {
  const rows = await query<SovCatalogo>('sov-catalogo');
  return rows[0] ?? null;
}

export async function loadRespuestas(qid: string): Promise<SovRespuestas[]> {
  const rows = await query<SovRespuestas>('sov-respuestas', 'qid', qid);
  return rows.sort((a, b) => b.date.localeCompare(a.date));
}

export async function loadRespuestasDeCorrida(date: string): Promise<SovRespuestas[]> {
  return query<SovRespuestas>('sov-respuestas', 'date', date);
}

export async function loadDebilidades(slug: string): Promise<SovDebilidades[]> {
  const rows = await query<SovDebilidades>('sov-debilidades', 'slug', slug);
  return rows.sort((a, b) => b.date.localeCompare(a.date));
}

export async function loadDebilidadesDeCorrida(date: string): Promise<SovDebilidades[]> {
  return query<SovDebilidades>('sov-debilidades', 'date', date);
}

export async function loadTodasDebilidades(): Promise<SovDebilidades[]> {
  return query<SovDebilidades>('sov-debilidades');
}

// ---------------------------------------------------------------- catalog helpers

export type PreguntaConCodigo = CatalogoPregunta & { codigo: string; cat: CatalogoCategoria };

/** Questions ordered by (categoria.orden, num) with their visible code. */
export function ordenCatalogo(cat: SovCatalogo): PreguntaConCodigo[] {
  const cats = new Map(cat.categorias.map((c) => [c.key, c]));
  return [...cat.preguntas]
    .map((p) => {
      const c = cats.get(p.categoria) ?? { key: p.categoria, prefijo: p.categoria.slice(0, 3).toUpperCase(), nombre: p.categoria, orden: 99, cuenta_sov: true };
      return { ...p, codigo: codigoDe(c.prefijo, p.num), cat: c };
    })
    .sort((a, b) => a.cat.orden - b.cat.orden || a.num - b.num);
}

export function categoriasOrdenadas(cat: SovCatalogo): CatalogoCategoria[] {
  return [...cat.categorias].sort((a, b) => a.orden - b.orden);
}

export function preguntaDe(cat: SovCatalogo | null, qid: string): PreguntaConCodigo | null {
  if (!cat) return null;
  return ordenCatalogo(cat).find((p) => p.id === qid) ?? null;
}

/** Ids present in any engine of a run, ordered by the catalog (unknown ids last, by id). */
export function idsDeCorrida(run: SovRun, cat: SovCatalogo | null): string[] {
  const ids = new Set<string>();
  for (const eng of Object.values(run.engines ?? {})) for (const r of eng.results ?? []) ids.add(r.id);
  const orden = new Map((cat ? ordenCatalogo(cat) : []).map((p, i) => [p.id, i]));
  return [...ids].sort((a, b) => {
    const ia = orden.get(a) ?? 1e6;
    const ib = orden.get(b) ?? 1e6;
    return ia - ib || a.localeCompare(b);
  });
}

// ---------------------------------------------------------------- cells and summaries

export type EstadoCelda = 'sin-medir' | 'nombra' | 'no' | 'sin-pregunta';

export function resultDe(run: SovRun, engine: string, qid: string) {
  return run.engines?.[engine]?.results?.find((r) => r.id === qid);
}

/** Distinguishes "0 mentions" from "not measured" (engine down or per-question error). */
export function estadoCelda(run: SovRun, engine: string, qid: string): EstadoCelda {
  const eng = run.engines?.[engine];
  if (!eng) return 'sin-pregunta';
  const r = eng.results?.find((x) => x.id === qid);
  if (!r) return eng.status === 'ok' ? 'sin-pregunta' : 'sin-medir';
  if (r.error || r.mentioned === undefined) return 'sin-medir';
  return r.mentioned ? 'nombra' : 'no';
}

export function motoresDeCorrida(run: SovRun): string[] {
  return ENGINE_KEYS.filter((e) => run.engines?.[e]);
}

export function motorOk(run: SovRun, engine: string): boolean {
  return run.engines?.[engine]?.status === 'ok';
}

export type Conteo = { mencionan: number; de: number };
export type FilaCategoria = {
  cat: CatalogoCategoria;
  porMotor: Record<string, Conteo>;
  ponderado: Record<string, { puntos: number; de_puntos: number }>;
  preguntas: number;
};

/**
 * Per-category share recomputed from the run's results joined with the live
 * catalog, so it works for runs uploaded before the catalog existed. Only
 * categories with `cuenta_sov` are listed.
 */
export function resumenPorCategoria(run: SovRun, cat: SovCatalogo): FilaCategoria[] {
  const pregs = new Map(cat.preguntas.map((p) => [p.id, p]));
  const motores = motoresDeCorrida(run).filter((e) => motorOk(run, e));
  return categoriasOrdenadas(cat)
    .filter((c) => c.cuenta_sov)
    .map((c) => {
      const porMotor: Record<string, Conteo> = {};
      const ponderado: Record<string, { puntos: number; de_puntos: number }> = {};
      for (const e of motores) {
        let mencionan = 0;
        let de = 0;
        let puntos = 0;
        let dePuntos = 0;
        for (const r of run.engines?.[e]?.results ?? []) {
          const p = pregs.get(r.id);
          if (!p || p.categoria !== c.key || r.mentioned === undefined || r.error) continue;
          de += 1;
          dePuntos += p.potencial;
          if (r.mentioned) {
            mencionan += 1;
            puntos += p.potencial;
          }
        }
        porMotor[e] = { mencionan, de };
        ponderado[e] = { puntos, de_puntos: dePuntos };
      }
      return { cat: c, porMotor, ponderado, preguntas: cat.preguntas.filter((p) => p.categoria === c.key && p.estado === 'activa').length };
    });
}

export type MencionesCompetidor = {
  slug: string;
  nombre: string;
  total: number;
  porMotor: Record<string, number>;
  porCategoria: Record<string, number>;
  corridas: number;
};

/**
 * Cumulative competitor mentions across runs (count-weighted for v2 runs;
 * v1 runs only carry `competitors_ordered`, counted once each).
 */
export function mencionesCompetidores(runs: SovRun[], cat: SovCatalogo | null): MencionesCompetidor[] {
  const pregs = new Map((cat?.preguntas ?? []).map((p) => [p.id, p]));
  const acc = new Map<string, MencionesCompetidor>();
  const vistoEnCorrida = new Map<string, Set<string>>();
  for (const run of runs) {
    for (const e of ENGINE_KEYS) {
      for (const r of run.engines?.[e]?.results ?? []) {
        const catKey = pregs.get(r.id)?.categoria ?? 'otra';
        const items = r.competitors?.length
          ? r.competitors.map((c) => ({ name: c.name, count: c.count }))
          : (r.competitors_ordered ?? []).map((name) => ({ name, count: 1 }));
        for (const { name, count } of items) {
          const slug = slugify(name);
          const m = acc.get(slug) ?? { slug, nombre: name, total: 0, porMotor: {}, porCategoria: {}, corridas: 0 };
          m.total += count;
          m.porMotor[e] = (m.porMotor[e] ?? 0) + count;
          m.porCategoria[catKey] = (m.porCategoria[catKey] ?? 0) + count;
          acc.set(slug, m);
          const s = vistoEnCorrida.get(slug) ?? new Set<string>();
          s.add(run.date);
          vistoEnCorrida.set(slug, s);
        }
      }
    }
  }
  for (const [slug, m] of acc) m.corridas = vistoEnCorrida.get(slug)?.size ?? 0;
  return [...acc.values()].sort((a, b) => b.total - a.total);
}

export function pct(m: Conteo | undefined): number | null {
  if (!m || !m.de) return null;
  return Math.round((m.mencionan / m.de) * 100);
}

/** "0/41"; a summary with nothing measured (engine down) prints "-" rather than a misleading "0/0". */
export function fmt(m: Conteo | undefined): string {
  return m && m.de ? `${m.mencionan}/${m.de}` : '-';
}
