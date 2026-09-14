import type { Metadata } from 'next';
import { SecurityView } from '@/components/wg/pages/SecurityView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.security.title,
  description: dict.meta.security.description,
  path: '/es/security',
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <SecurityView dict={dict} locale="es" />;
}
