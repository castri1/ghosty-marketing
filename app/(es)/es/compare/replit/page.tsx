import type { Metadata } from 'next';
import { CompareToolView } from '@/components/wg/pages/CompareToolView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

const PATH = '/es/compare/replit';

export const metadata: Metadata = pageMeta({
  title: dict.meta.compareReplit.title,
  description: dict.meta.compareReplit.description,
  path: PATH,
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <CompareToolView dict={dict} locale="es" tool="compareReplit" path={PATH} />;
}
