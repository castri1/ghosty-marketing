import type { Metadata } from 'next';
import { CompareStackView } from '@/components/wg/pages/CompareStackView';
import { es as dict } from '@/lib/i18n/es';
import { pageMeta } from '@/lib/site';

export const metadata: Metadata = pageMeta({
  title: dict.meta.compareStack.title,
  description: dict.meta.compareStack.description,
  path: '/es/compare/stack',
  locale: 'es',
});

// Bounded CDN TTL: see app/page.tsx (CAS-127).
export const revalidate = 3600;

export default function Page() {
  return <CompareStackView dict={dict} locale="es" />;
}
