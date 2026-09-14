import type { Metadata } from 'next';
import { CompareHubView } from '@/components/wg/pages/CompareHubView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.compareHub.title,
  description: dict.meta.compareHub.description,
  path: '/es/compare',
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <CompareHubView dict={dict} locale="es" />;
}
