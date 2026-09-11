import { getDb } from '@/lib/firestore';
import { METRICS_COLLECTION, type Ga4Summary } from '@/lib/metrics-types';

/** Most recent weekly GA4 digest, or null (store errors are swallowed like every admin reader). */
export async function loadMetricGa4(): Promise<Ga4Summary | null> {
  try {
    const snap = await getDb().collection(METRICS_COLLECTION).where('kind', '==', 'ga4-summary').get();
    const rows = snap.docs.map((d) => d.data() as Ga4Summary).filter((g) => g?.week);
    return rows.sort((a, b) => b.week.localeCompare(a.week))[0] ?? null;
  } catch (err) {
    console.warn(`[admin] ga4 read unavailable (${err instanceof Error ? err.message : String(err)})`);
    return null;
  }
}
