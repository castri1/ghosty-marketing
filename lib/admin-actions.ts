'use server';

import { revalidatePath } from 'next/cache';
import { getDb } from '@/lib/firestore';
import { METRICS_COLLECTION, sovCatalogoSchema, type SovCatalogo } from '@/lib/metrics-types';

/**
 * Server actions behind /admin/preguntas. They mutate the single catalog
 * document (`sov-catalogo-actual`) inside a transaction and validate the
 * whole document with the strict schema before writing, so the admin can
 * never leave a catalog the measurement script would reject.
 *
 * Auth: the actions POST to /admin/..., which middleware.ts guards with
 * Basic Auth; no extra check is needed here.
 */

const DOC_ID = 'sov-catalogo-actual';

async function mutarCatalogo(mutate: (cat: SovCatalogo) => SovCatalogo | void): Promise<void> {
  const db = getDb();
  const ref = db.collection(METRICS_COLLECTION).doc(DOC_ID);
  await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (!snap.exists) throw new Error('catalogo inexistente: corre medir_sov.py --sembrar-catalogo');
    const { kind: _k, id: _i, updatedAt: _u, ...raw } = snap.data() as Record<string, unknown>;
    const actual = sovCatalogoSchema.parse(raw);
    const siguiente = mutate(actual) ?? actual;
    siguiente.actualizado = new Date().toISOString();
    const parsed = sovCatalogoSchema.parse(siguiente);
    tx.set(ref, { ...parsed, kind: 'sov-catalogo', id: 'actual', updatedAt: new Date().toISOString() });
  });
  revalidatePath('/admin', 'layout');
}

function pregunta(cat: SovCatalogo, qid: string) {
  const p = cat.preguntas.find((x) => x.id === qid);
  if (!p) throw new Error(`pregunta desconocida: ${qid}`);
  return p;
}

export async function setPotencial(qid: string, formData: FormData): Promise<void> {
  const n = Number(formData.get('potencial'));
  if (![1, 2, 3].includes(n)) throw new Error('potencial invalido');
  await mutarCatalogo((cat) => {
    pregunta(cat, qid).potencial = n as 1 | 2 | 3;
  });
}

export async function setEstado(qid: string, formData: FormData): Promise<void> {
  const estado = String(formData.get('estado'));
  if (estado !== 'activa' && estado !== 'descartada') throw new Error('estado invalido');
  await mutarCatalogo((cat) => {
    const p = pregunta(cat, qid);
    p.estado = estado;
    if (estado === 'descartada') p.hasta_version = cat.version;
    else delete p.hasta_version;
  });
}

export async function setNota(qid: string, formData: FormData): Promise<void> {
  const nota = String(formData.get('nota') ?? '').trim().slice(0, 500);
  await mutarCatalogo((cat) => {
    pregunta(cat, qid).nota = nota;
  });
}

export async function crearPregunta(formData: FormData): Promise<void> {
  const categoria = String(formData.get('categoria'));
  const lang = String(formData.get('lang'));
  const persona = String(formData.get('persona'));
  const texto = String(formData.get('texto') ?? '').trim();
  const potencial = Number(formData.get('potencial'));
  const nota = String(formData.get('nota') ?? '').trim().slice(0, 500);
  if (texto.length < 8) throw new Error('texto muy corto');
  await mutarCatalogo((cat) => {
    if (!cat.categorias.some((c) => c.key === categoria)) throw new Error('categoria desconocida');
    const maxId = cat.preguntas.reduce((m, p) => Math.max(m, Number(p.id.slice(1)) || 0), 0);
    const maxNum = cat.preguntas.filter((p) => p.categoria === categoria).reduce((m, p) => Math.max(m, p.num), 0);
    const version = cat.version + 1;
    cat.version = version;
    cat.preguntas.push({
      id: `q${String(maxId + 1).padStart(2, '0')}`,
      categoria: categoria as SovCatalogo['preguntas'][number]['categoria'],
      num: maxNum + 1,
      lang: lang as 'en' | 'es',
      persona: persona as 'no-tecnico' | 'ceo' | 'tecnico',
      texto,
      potencial: potencial as 1 | 2 | 3,
      estado: 'activa',
      nota,
      desde_version: version,
      creada: new Date().toISOString().slice(0, 10),
    });
  });
}
