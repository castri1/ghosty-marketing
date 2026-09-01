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
 * (rutinas/sov/medir_sov.py): the questions asked to each engine via clean
 * API calls, whether each answer mentioned White Ghost, and which
 * competitors it named. `engines` keeps the per-question detail; `summary`
 * is what the chart reads.
 */
const sovQuestionResult = z
  .object({
    id: z.string().min(1),
    mentioned: z.boolean().optional(),
    competitors_ordered: z.array(z.string()).optional(),
    answer_excerpt: z.string().optional(),
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

const sovSchema = z
  .object({
    date: calendarDate,
    questions_version: z.number().int().min(1),
    engines: z.record(z.string(), sovEngineRun).default({}),
    summary: z.record(z.string(), sovCount).default({}),
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
