import type { Metadata } from 'next';
import { CompareVercelView } from '@/components/wg/pages/CompareVercelView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.compareVercel.title,
  description: dict.meta.compareVercel.description,
  path: '/es/compare/vercel',
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <CompareVercelView dict={dict} locale="es" />;
}
