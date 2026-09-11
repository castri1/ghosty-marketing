import { z } from 'zod';

/**
 * Metrics registry for the /admin dashboard. Deliberately NOT part of
 * lib/content-types.ts: that registry drives public surfaces (public GET,
 * sitemap, llms.txt, raw markdown, RSS) by design, and metrics are
 * operator-only. Reads and writes both require the bearer token
 * (`MARKETING_CONTENT_TOKEN`) — see app/api/metrics/.
 *
 * Storage: Firestore collection `marketing_metrics` (additive alongside the
 * content collections), document id `<kind>-<id>`.
 */

const calendarDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'YYYY-MM-DD');
const isoWeek = z.string().regex(/^\d{4}-W\d{2}$/, 'YYYY-Www (ISO week)');

/**
 * One share-of-voice run, as produced by the local measurement script
 * (rutinas/sov/medir_sov.py). v1 runs (2026-08-31) carry only `id`,
 * `mentioned`, `competitors_ordered`, `answer_excerpt` and a `{mencionan, de}`
 * summary per engine; v2 runs add per-competitor counts and ranks,
 * Perplexity citations, brand-disambiguation checks and per-language /
 * per-intent breakdowns. Every v2 field is optional so v1 documents keep
 * validating. The full answer text never reaches this API: it stays in the
 * local sov-history (Firestore caps documents at 1 MB).
 */
const sovCompetitor = z
  .object({
    name: z.string().min(1),
    first_pos: z.number().int().min(0),
    count: z.number().int().min(0),
    rank: z.number().int().min(1),
  })
  .strict();

const sovQuestionResult = z
  .object({
    id: z.string().min(1),
    mentioned: z.boolean().optional(),
    self_rank: z.number().int().nullable().optional(),
    competitors_ordered: z.array(z.string()).optional(),
    competitors: z.array(sovCompetitor).optional(),
    citations: z.array(z.string()).optional(),
    cites_self: z.boolean().optional(),
    marca_ok: z.boolean().nullable().optional(),
    answer_excerpt: z.string().optional(),
    usage: z.object({ input: z.number().int(), output: z.number().int() }).strict().optional(),
    error: z.string().optional(),
  })
  .strict();

const sovEngineRun = z
  .object({
    status: z.string().min(1),
    model: z.string().optional(),
    errors: z.number().int().optional(),
    results: z.array(sovQuestionResult).default([]),
  })
  .strict();

const sovCount = z.object({ mencionan: z.number().int(), de: z.number().int() }).strict();

/** Per-engine (or per-series: parametrico, browsing, agregado) summary. */
const sovSummary = sovCount
  .extend({
    nucleo_v1: sovCount.optional(),
    marca: z.object({ correctas: z.number().int(), de: z.number().int() }).strict().optional(),
    por_lang: z.record(z.string(), sovCount).optional(),
    por_intent: z.record(z.string(), sovCount).optional(),
    citan_whiteghost: z.number().int().optional(),
    /** v3 (catalog-driven): breakdowns by catalog category, persona and potencial. */
    por_categoria: z.record(z.string(), sovCount).optional(),
    por_persona: z.record(z.string(), sovCount).optional(),
    por_potencial: z.record(z.string(), sovCount).optional(),
    /** Potencial-weighted share: sum of potencial over mentioned / over measured. */
    ponderado: z.object({ puntos: z.number().int(), de_puntos: z.number().int() }).strict().optional(),
  })
  .strict();

const sovTopRow = z.object({ name: z.string().min(1), count: z.number().int().min(0) }).strict();

const sovCandidate = z
  .object({ texto: z.string(), veces: z.number().int(), motores: z.array(z.string()) })
  .strict();

const sovSchema = z
  .object({
    date: calendarDate,
    questions_version: z.number().int().min(1),
    engines: z.record(z.string(), sovEngineRun).default({}),
    summary: z.record(z.string(), sovSummary).default({}),
    /** Per-engine leaderboard as objects: Firestore rejects nested arrays, so no tuples here. */
    competidores_top: z.record(z.string(), z.array(sovTopRow)).optional(),
    candidatos_marcas: z.array(sovCandidate).optional(),
    /** Catalog version the run was measured against (v3+). */
    catalogo_version: z.number().int().min(1).optional(),
  })
  .strict();

/**
 * Weekly GA4 summary. GA4 has no live wiring into this app: the operator's
 * agent reads GA4 (via its own connector) and PUTs the digest here.
 */
const ga4ReferrerRow = z
  .object({
    source: z.string().min(1),
    sessions: z.number().int().min(0),
  })
  .strict();

const ga4SummarySchema = z
  .object({
    week: isoWeek,
    sessions_total: z.number().int().min(0).optional(),
    llm_referrers: z.array(ga4ReferrerRow).default([]),
    notes: z.string().optional(),
  })
  .strict();

/**
 * Question catalog (v3, 2026-09-11): the source of truth for what the SoV
 * run asks. Lives in Firestore as a single document (`sov-catalogo-actual`);
 * the local measurement script downloads it before every run and keeps
 * rutinas/sov/preguntas.json only as a snapshot. Edited from /admin/preguntas
 * (potencial, estado, nota, new questions) via server actions.
 *
 * `num` is fixed at creation (max+1 within the category) and never renumbered
 * when a question is discarded, so the visible code (`DEP-03`) stays stable.
 * `id` (`q13`) remains the join key with every historical run.
 */
export const CATEGORIA_KEYS = [
  'compartir-localhost',
  'deploy',
  'artefacto',
  'equipo',
  'alternativa',
  'marca',
  'negativa',
] as const;
export type CategoriaKey = (typeof CATEGORIA_KEYS)[number];

const catalogoCategoria = z
  .object({
    key: z.enum(CATEGORIA_KEYS),
    prefijo: z.string().regex(/^[A-Z]{3}$/),
    nombre: z.string().min(1),
    orden: z.number().int().min(0),
    /** false = measured but excluded from the share-of-voice count (marca, negativa). */
    cuenta_sov: z.boolean(),
  })
  .strict();

const catalogoPregunta = z
  .object({
    id: z.string().regex(/^q\d{2,}$/),
    categoria: z.enum(CATEGORIA_KEYS),
    num: z.number().int().min(1),
    lang: z.enum(['en', 'es']),
    persona: z.enum(['no-tecnico', 'ceo', 'tecnico']),
    texto: z.string().min(8),
    /** Fit with what White Ghost does today: 3 exact use case, 2 adjacent, 1 not solved today. */
    potencial: z.union([z.literal(1), z.literal(2), z.literal(3)]),
    estado: z.enum(['activa', 'descartada']),
    nota: z.string().default(''),
    desde_version: z.number().int().min(1),
    hasta_version: z.number().int().min(1).optional(),
    creada: calendarDate,
  })
  .strict();

const catalogoNegativas = z
  .object({
    competidores: z.array(
      z.object({ slug: z.string().regex(/^[a-z0-9-]+$/), nombre: z.string().min(1) }).strict(),
    ),
    plantillas: z.array(
      z
        .object({
          id: z.string().regex(/^d\d{2}$/),
          lang: z.enum(['en', 'es']),
          texto: z.string().refine((t) => t.includes('{competidor}'), 'must contain {competidor}'),
        })
        .strict(),
    ),
  })
  .strict();

export const sovCatalogoSchema = z
  .object({
    version: z.number().int().min(1),
    actualizado: z.string().min(1),
    categorias: z.array(catalogoCategoria),
    preguntas: z.array(catalogoPregunta),
    negativas: catalogoNegativas,
  })
  .strict()
  .superRefine((cat, ctx) => {
    const ids = new Set<string>();
    const pares = new Set<string>();
    const cats = new Set(cat.categorias.map((c) => c.key));
    for (const p of cat.preguntas) {
      if (ids.has(p.id)) ctx.addIssue({ code: 'custom', message: `duplicate id ${p.id}` });
      ids.add(p.id);
      const par = `${p.categoria}#${p.num}`;
      if (pares.has(par)) ctx.addIssue({ code: 'custom', message: `duplicate (categoria, num) ${par}` });
      pares.add(par);
      if (!cats.has(p.categoria)) ctx.addIssue({ code: 'custom', message: `unknown categoria ${p.categoria}` });
    }
  });

/**
 * Full answers of one run for one question, one document per (date, qid)
 * (`sov-respuestas-2026-09-11-q13`, ~6 KB). Mention fields are duplicated
 * from the `sov` document so a question's history resolves with a single
 * equality query on `qid`.
 */
const sovRespuestaMotor = z
  .object({
    model: z.string().optional(),
    answer_full: z.string().optional(),
    citations: z.array(z.string()).optional(),
    usage: z.object({ input: z.number().int(), output: z.number().int() }).strict().optional(),
    mentioned: z.boolean().optional(),
    self_rank: z.number().int().nullable().optional(),
    competitors: z.array(sovCompetitor).optional(),
    cites_self: z.boolean().optional(),
    error: z.string().optional(),
  })
  .strict();

export const sovRespuestasSchema = z
  .object({
    date: calendarDate,
    qid: z.string().regex(/^q\d{2,}$/),
    questions_version: z.number().int().min(1).optional(),
    engines: z.record(z.string(), sovRespuestaMotor).default({}),
  })
  .strict();

/**
 * Weakness probe ("negative questions") of one run for one competitor, one
 * document per (date, slug). `origen` says whether the competitor came from
 * the fixed list in the catalog or from that week's top mentions.
 */
const sovDebilidadItem = z
  .object({
    plantilla: z.string().regex(/^d\d{2}$/),
    lang: z.enum(['en', 'es']).optional(),
    pregunta: z.string().min(1),
    respuesta: z.string().optional(),
    citations: z.array(z.string()).optional(),
    bullets: z.array(z.string()).optional(),
    menciona_whiteghost: z.boolean().optional(),
    usage: z.object({ input: z.number().int(), output: z.number().int() }).strict().optional(),
    error: z.string().optional(),
  })
  .strict();

export const sovDebilidadesSchema = z
  .object({
    date: calendarDate,
    slug: z.string().regex(/^[a-z0-9-]+$/),
    competidor: z.string().min(1),
    origen: z.enum(['lista-fija', 'top']),
    questions_version: z.number().int().min(1).optional(),
    engines: z.record(z.string(), z.array(sovDebilidadItem)).default({}),
  })
  .strict();

export type SovRun = z.infer<typeof sovSchema>;
export type SovCatalogo = z.infer<typeof sovCatalogoSchema>;
export type CatalogoPregunta = z.infer<typeof catalogoPregunta>;
export type CatalogoCategoria = z.infer<typeof catalogoCategoria>;
export type SovRespuestas = z.infer<typeof sovRespuestasSchema>;
export type SovRespuestaMotor = z.infer<typeof sovRespuestaMotor>;
export type SovDebilidades = z.infer<typeof sovDebilidadesSchema>;
export type SovDebilidadItem = z.infer<typeof sovDebilidadItem>;

/** Visible code of a catalog question: `DEP-03`. Mirrors `codigo_de` in medir_sov.py. */
export function codigoDe(prefijo: string, num: number): string {
  return `${prefijo}-${String(num).padStart(2, '0')}`;
}

/** Competitor slug: `GitHub Pages` -> `github-pages`. Mirrors `slugify` in medir_sov.py. */
export function slugify(nombre: string): string {
  return nombre
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
export type SovSummary = z.infer<typeof sovSummary>;
export type Ga4Summary = z.infer<typeof ga4SummarySchema>;

export interface MetricKind<T = Record<string, unknown>> {
  /** API path segment and the `kind` field stamped on stored documents. */
  key: string;
  schema: z.ZodType<T>;
  /** Canonical id for an entry — must equal the `[id]` route segment. */
  idFor: (entry: T) => string;
}

export const METRIC_KINDS: MetricKind[] = [
  { key: 'sov', schema: sovSchema, idFor: (e) => (e as SovRun).date } as MetricKind,
  {
    key: 'ga4-summary',
    schema: ga4SummarySchema,
    idFor: (e) => (e as Ga4Summary).week,
  } as MetricKind,
  { key: 'sov-catalogo', schema: sovCatalogoSchema, idFor: () => 'actual' } as MetricKind,
  {
    key: 'sov-respuestas',
    schema: sovRespuestasSchema,
    idFor: (e) => `${(e as SovRespuestas).date}-${(e as SovRespuestas).qid}`,
  } as MetricKind,
  {
    key: 'sov-debilidades',
    schema: sovDebilidadesSchema,
    idFor: (e) => `${(e as SovDebilidades).date}-${(e as SovDebilidades).slug}`,
  } as MetricKind,
];

export const METRICS_COLLECTION = 'marketing_metrics';

export function findMetricKind(key: string): MetricKind | undefined {
  return METRIC_KINDS.find((k) => k.key === key);
}
