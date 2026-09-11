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

export type SovRun = z.infer<typeof sovSchema>;
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
];

export const METRICS_COLLECTION = 'marketing_metrics';

export function findMetricKind(key: string): MetricKind | undefined {
  return METRIC_KINDS.find((k) => k.key === key);
}
